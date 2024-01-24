import sys
import pdb
import os
import cv2
import numpy as np

import torchvision
from torch import nn
from torch.nn import functional as F

from .tps_stn import TPSSpatialTransformer
from .stn_head import STNHead
from .res_crnn import CRNN as ResCRNN
from .affine_stn import STNHead as AffineSTNHead
from .basic_crnn import CRNN

class ModelBuilder(nn.Module):
    """
    This is the integrated model.
    """

    def __init__(self, imgH, imgW, tps_inputsize,
                 tps_outputsize, num_control_points, tps_margins, stn_activation,
                 nh, stn_nc, cnn_nc, nclass, n_rnn=2, leakyRelu=False,
                 STN_type = 'TPS', att_type=None, nheads=1, stn_attn='SE',
                 use_loc_bn=False, loc_block='LocNet', CNN='ResCRNN'):
        super(ModelBuilder, self).__init__()

        self.imgH = imgH
        self.imgW = imgW
        self.nh = nh
        self.rec_num_classes = nclass
        self.tps_inputsize = tps_inputsize
        self.STN_type = STN_type
        if CNN == 'ResCRNN':
            self.crnn = ResCRNN(self.imgH, cnn_nc, nclass, self.nh, n_rnn=n_rnn,
                                leakyRelu=leakyRelu, att_type=att_type)
        else:
            self.crnn = CRNN(self.imgH, cnn_nc, nclass, self.nh, n_rnn=n_rnn,
                                leakyRelu=leakyRelu)

        print(f'Using {self.STN_type} STN type with {nheads} heads')
        if self.STN_type == 'TPS':
            self.tps = TPSSpatialTransformer(
                output_image_size=tuple(tps_outputsize),
                num_control_points=num_control_points,
                margins=tuple(tps_margins))
            self.stn_head = STNHead(
                in_planes=stn_nc,
                num_ctrlpoints=num_control_points,
                activation=stn_activation)
        elif self.STN_type == 'Affine':
            self.stn_head = AffineSTNHead(inplanes=stn_nc,
                                          tps_inputsize=tps_inputsize,
                                          nheads=nheads,
                                          use_bn=use_loc_bn)
        else:
            self.stn_head = None


    def forward(self, x):
        return_dict = {}
        return_dict['params'] = None
        if self.STN_type == 'TPS':
            stn_input = F.interpolate(x, self.tps_inputsize, mode='bilinear',
                                      align_corners=True)
            _, ctrl_points = self.stn_head(stn_input)
            x, _ = self.tps(x, ctrl_points)
            return_dict['params'] = ctrl_points
            if not self.training:
                return_dict['rectified_images'] = x
        elif self.stn_head != None:
            x, params = self.stn_head(x)
            return_dict['params'] = params
            if not self.training:
                return_dict['rectified_images'] = x
        return_dict['probs'] = self.crnn(x)
        return return_dict
