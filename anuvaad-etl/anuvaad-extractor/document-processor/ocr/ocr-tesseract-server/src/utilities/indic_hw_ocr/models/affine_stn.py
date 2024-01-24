import torch.nn.functional as F
import torch.nn as nn
import torch
import pdb
import cv2
import os

# 3x3 convolution
def conv3x3(in_channels, out_channels, stride=1):
    return nn.Conv2d(in_channels, out_channels, kernel_size=3,
                     stride=stride, padding=1, bias=False)

# Residual block
class ResidualBlock(nn.Module):
    def __init__(self, in_channels, out_channels, stride=1, downsample=None):
        super(ResidualBlock, self).__init__()
        self.conv1 = conv3x3(in_channels, out_channels, stride)
        self.bn1 = nn.BatchNorm2d(out_channels)
        self.relu = nn.ReLU(inplace=True)
        self.conv2 = conv3x3(out_channels, out_channels)
        self.bn2 = nn.BatchNorm2d(out_channels)
        self.downsample = downsample

    def forward(self, x):
        residual = x
        out = self.conv1(x)
        out = self.bn1(out)
        out = self.relu(out)
        out = self.conv2(out)
        out = self.bn2(out)
        if self.downsample:
            residual = self.downsample(x)
        out += residual
        out = self.relu(out)
        return out

class LocNet(nn.Module):
    def __init__(self, block, layers, nparams=30, linear_in=512):
        super(LocNet, self).__init__()
        print('Loc using ResBlocks')
        self.in_channels = 16
        self.conv = conv3x3(1, 16)
        self.bn = nn.BatchNorm2d(16)
        self.relu = nn.ReLU(inplace=True)
        self.layer1 = self.make_layer(block, 16, layers[0])
        self.avg_pool = nn.AvgPool2d(8)
        self.fc = nn.Linear(linear_in, nparams)

    def make_layer(self, block, out_channels, blocks, stride=1):
        downsample = None
        if (stride != 1) or (self.in_channels != out_channels):
            downsample = nn.Sequential(
                conv3x3(self.in_channels, out_channels, stride=stride),
                nn.BatchNorm2d(out_channels))
        layers = []
        layers.append(block(self.in_channels, out_channels, stride, downsample))
        self.in_channels = out_channels
        for i in range(1, blocks):
            layers.append(block(out_channels, out_channels))
        return nn.Sequential(*layers)

    def forward(self, x):
        out = self.conv(x)
        out = self.bn(out)
        out = self.relu(out)
        out = self.layer1(out)
        out = self.avg_pool(out)
        # pdb.set_trace()
        out = out.view(out.size(0), -1)
        out = self.fc(out)
        return out

class LocalizationNet(nn.Module):
    def __init__(self, inplanes, inputsize, nheads=1, use_bn=False):
        super(LocalizationNet, self).__init__()
        inputH, inputW = inputsize
        self.use_bn = use_bn
        if self.use_bn:
            print('Using BN in LocalizationNet')
        self.pool = nn.MaxPool2d(2, stride=2)
        # self.relu = nn.LeakyReLU(True)
        self.relu = nn.ReLU(inplace=True)
        self.conv1 = nn.Conv2d(inplanes, 64, kernel_size=3, stride=1, padding=1)
        if self.use_bn:
            self.bn1 = nn.BatchNorm2d(64)
        self.conv2 = None
        self.conv3 = None
        self.factor = 4  # input reduces by //self.factor
        self.channels = 64
        if inputH>=8:
            self.conv2 = nn.Conv2d(64, 64, kernel_size=3, stride=1, padding=1)
            self.channels = 64
            self.factor = 8
            if self.use_bn:
                self.bn2 = nn.BatchNorm2d(64)
        if inputH>=16:
            self.conv3 = nn.Conv2d(64, 128, kernel_size=3, stride=1, padding=1)
            self.channels = 128
            self.factor = 16
            if self.use_bn:
                self.bn3 = nn.BatchNorm2d(128)


        self.nheads = nheads
        if self.nheads > 1:
            # print(inputH//self.factor, inputW//self.factor)
            self.nlinear = []
            if self.nheads >= 5:
                self.conv3 = None
                self.factor = 8
                self.channels = 64

            fw = inputW//self.factor
            self.fw_strip = [fw//nheads for i in range(nheads)]
            if fw%nheads!=0:
                self.fw_strip[-1] += 1

            for i in range(nheads):
                # pdb.set_trace()
                self.nlinear.append(nn.Linear(self.channels*(inputH//self.factor)*self.fw_strip[i], 30))
            self.nlinear = nn.ModuleList(self.nlinear)
            # self.inplanes =
        else:
            self.inplanes = self.channels*(inputH//self.factor)*(inputW//self.factor)
            self.linear = nn.Linear(self.inplanes, 30)
        # self.linear = nn.Linear(128*3*62, 30) # line

    def forward(self, x):
        # print(x.shape)
        # pdb.set_trace()
        x = self.pool(x)
        x = self.conv1(x)
        x = self.relu(x)
        if self.use_bn:
            x = self.bn1(x)
        x = self.pool(x)
        if self.conv2:
            x = self.conv2(x)
            x = self.relu(x)
            if self.use_bn:
                x = self.bn2(x)
            x = self.pool(x)
        if self.conv3:
            x = self.conv3(x)
            x = self.relu(x)
            if self.use_bn:
                x = self.bn3(x)
            x = self.pool(x)
        # print(x.shape)
        # pdb.set_trace()
        if self.nheads > 1:
            b = x.size(0)
            tx = []
            start = 0
            for i in range(self.nheads):
                end = start + self.fw_strip[i]
                x_ = x[:, :, :, start:end]
                # print(x_.shape, start-end)
                x_ = x_.reshape(b, -1)
                x_ = self.relu(self.nlinear[i](x_))
                start = end
                tx.append(x_)
            x = tx
        else:
            x = x.view(-1, self.inplanes)
            x = self.linear(x)
            x = self.relu(x)
        return x


class STNHead(nn.Module):
    def __init__(self, inplanes, tps_inputsize, nheads=1, use_bn=False):
        print('Using align_corners=True in affine STN')
        super(STNHead, self).__init__()
        self.nheads = nheads
        self.tps_inputsize = tps_inputsize
        self.localization = LocalizationNet(inplanes, tps_inputsize, self.nheads, use_bn=use_bn)
        # self.localization = LocNet(ResidualBlock, [2])
        # self.localization = LocNet(ResidualBlock, [2], linear_in=128*3*46) # linear_in for tps_inputsize [48, 750]
        self.fc_loc = nn.Sequential(
                        nn.Linear(10 * 3, 3*2),
                      )
        self.fc_loc[0].weight.data.zero_()
        self.fc_loc[0].bias.data.copy_(torch.tensor([1, 0, 0, 0, 1, 0],
                                       dtype=torch.float))



    def forward(self, x):
        # input images are downsampled before being fed into stn_head.
        stn_input = F.interpolate(x, self.tps_inputsize, mode='bilinear',
                                  align_corners=True)
        xs = self.localization(stn_input)
        xs = xs.view(-1, 10 * 3 )
        theta = self.fc_loc(xs)
        theta = theta.view(-1, 2, 3)
        grid = F.affine_grid(theta, x.size())
        x = F.grid_sample(x, grid)
        return x, theta
