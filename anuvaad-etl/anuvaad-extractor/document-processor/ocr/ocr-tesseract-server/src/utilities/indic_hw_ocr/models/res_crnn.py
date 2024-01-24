'''
CRNN
with BatchNorm2d, Residual blocks,Dropout in RNN
STN,
'''

import torch.nn as nn
import torch
import pdb
import torch.nn.functional as F
from .affine_stn import STNHead as AffineSTNHead
import matplotlib.pyplot as plt
from src.utilities.indic_hw_ocr.utils import *


class BidirectionalLSTM(nn.Module):

	def __init__(self, nIn, nHidden, nOut):
		super(BidirectionalLSTM, self).__init__()

		self.rnn = nn.LSTM(nIn, nHidden, bidirectional=True)
		self.embedding = nn.Linear(nHidden * 2, nOut)
		self.dropout = nn.Dropout2d(p=0.2)

	def forward(self, input):
		# pdb.set_trace()
		self.rnn.flatten_parameters()
		recurrent, _ = self.rnn(input)
		T, b, h = recurrent.size()
		t_rec = recurrent.view(T * b, h)
		t_rec = self.dropout(t_rec)

		output = self.embedding(t_rec)  # [T * b, nOut]
		output = output.view(T, b, -1)

		return output


class ResidualBlock(nn.Module):
	def __init__(self, nIn1, nOut1, ks1, ss1, ps1,
				 nIn2, nOut2, ks2, ss2, ps2, downsample=None,
				 bn2_active=True, att_type=None, stn_inputsize=None,
				 stn_nheads=1):
		super(ResidualBlock, self).__init__()
		self.conv1 = nn.Conv2d(nIn1, nOut1, ks1, ss1, ps1)
		self.bn1 = nn.BatchNorm2d(nIn1)
		self.relu = nn.ReLU(inplace=True)
		self.conv2 = nn.Conv2d(nIn2, nOut2, ks2, ss2, ps2)
		self.downsample = downsample
		self.bn2_active = bn2_active
		if self.bn2_active:
			self.bn2 = nn.BatchNorm2d(nIn2)
		if stn_inputsize:
			self.stn = AffineSTNHead(inplanes=nIn1,
									 tps_inputsize=stn_inputsize,
									 nheads=stn_nheads)
			# pdb.set_trace()
		else:
			self.stn = None

	def forward(self, x):
		residual = x
		out = self.bn1(x)
		out = self.relu(out)
		out = self.conv1(out)
		if self.bn2_active:
			out = self.bn2(out)
		out = self.relu(out)
		out = self.conv2(out)
		if self.downsample:
			residual = self.downsample(x)
		out += residual

		if self.stn:
			rectified, _  = self.stn(out)
			out = rectified
		return out


class CRNN(nn.Module):

	def __init__(self, imgH, nc, nclass, nh, n_rnn=2, leakyRelu=False, STN=True, att_type=None):
		super(CRNN, self).__init__()
		# assert imgH % 16 == 0, 'imgH has to be a multiple of 16'
		print('Using Attention type in CRNN:', att_type)
		ks = [3, 3, 3, 3, 3,
			  3, 3, 3, 3,
			  3, 3, 3, 3,
			  3, 3, 3, 3, 3]  # filter size
		ps = [1, 1, 1, 1, 1,
			  1, 1, 1, 1,
			  1, 1, 1, 1,
			  1, 1, 1, 1, 0]  # padding
		ks = [3, 3, 3, 3, 3,
			  3, 3, 3, 3,
			  3, 3, 3, 3,
			  3, 3, 3, 3, 3]  # filter size
		ps = [1, 1, 1, 1, 1,
			  1, 1, 1, 1,
			  1, 1, 1, 1,
			  1, 1, 1, 1, 0]  # padding
		ss = [1, 1, 1, 1, 1,
			  1, 1, 1, 1,
			  1, 1, 1, 1,
			  1, 1, 1, 1, 1]  # stride parameter
		nm = [64, 64, 64, 64, 64,
			  128, 128, 128, 128,
			  256, 256, 256, 256,
			  512, 512, 512, 512, 512]  # number of channels

		cnn = nn.Sequential()

		def convRelu(i, BatchNorm2d=False):
			nIn = nc if i == 0 else nm[i - 1]
			nOut = nm[i]
			cnn.add_module('conv{0}'.format(i),
						   nn.Conv2d(nIn, nOut, ks[i], ss[i], ps[i]))
			if BatchNorm2d:
				cnn.add_module('batchnorm{0}'.format(i), nn.BatchNorm2d(nOut))
			if leakyRelu:
				cnn.add_module('relu{0}'.format(i),
							   nn.LeakyReLU(0.2, inplace=True))
			else:
				cnn.add_module('relu{0}'.format(i), nn.ReLU(True))

		convRelu(0, True)
		cnn.add_module('pooling{0}'.format(
			0), nn.MaxPool2d((2, 2), stride=(2, 2)))

		nIn1, nOut1, ks1, ss1, ps1 = nm[0], nm[1], ks[1], ss[1], ps[1]
		nIn2, nOut2, ks2, ss2, ps2 = nm[1], nm[2], ks[2], ss[2], ps[2]
		cnn.add_module('residualBlock{0}'.format(12), ResidualBlock(nIn1, nOut1, ks1, ss1, ps1,
																	nIn2, nOut2, ks2, ss2, ps2,
																	))

		nIn1, nOut1, ks1, ss1, ps1 = nm[2], nm[3], ks[3], ss[3], ps[3]
		nIn2, nOut2, ks2, ss2, ps2 = nm[3], nm[4], ks[4], ss[4], ps[4]
		cnn.add_module('residualBlock{0}'.format(34), ResidualBlock(nIn1, nOut1, ks1, ss1, ps1,
																	nIn2, nOut2, ks2, ss2, ps2,
																	))
		cnn.add_module('pooling{0}'.format(
			1), nn.MaxPool2d((2, 2), stride=(2, 2)))

		nIn1, nOut1, ks1, ss1, ps1 = nm[4], nm[5], ks[5], ss[5], ps[5]
		nIn2, nOut2, ks2, ss2, ps2 = nm[5], nm[6], ks[6], ss[6], ps[6]
		downsample = nn.Sequential(nn.Conv2d(nIn1, nOut2, 1, 1, 0))
		cnn.add_module('residualBlock{0}'.format(56), ResidualBlock(nIn1, nOut1, ks1, ss1, ps1,
																	nIn2, nOut2, ks2, ss2, ps2,
																	downsample,
																	))
		nIn1, nOut1, ks1, ss1, ps1 = nm[6], nm[7], ks[7], ss[7], ps[7]
		nIn2, nOut2, ks2, ss2, ps2 = nm[7], nm[8], ks[8], ss[8], ps[8]
		cnn.add_module('residualBlock{0}'.format(78), ResidualBlock(nIn1, nOut1, ks1, ss1, ps1,
																	nIn2, nOut2, ks2, ss2, ps2,
																	))
		cnn.add_module('pooling{0}'.format(
			2), nn.MaxPool2d((2, 2), stride=(2, 2)))

		nIn1, nOut1, ks1, ss1, ps1 = nm[8], nm[9], ks[9], ss[9], ps[9]
		nIn2, nOut2, ks2, ss2, ps2 = nm[9], nm[10], ks[10], ss[10], ps[10]
		downsample = nn.Sequential(nn.Conv2d(nIn1, nOut2, 1, 1, 0))
		cnn.add_module('residualBlock{0}'.format(910), ResidualBlock(nIn1, nOut1, ks1, ss1, ps1,
																	 nIn2, nOut2, ks2, ss2, ps2,
																	 downsample,
																	))
		nIn1, nOut1, ks1, ss1, ps1 = nm[10], nm[11], ks[11], ss[11], ps[11]
		nIn2, nOut2, ks2, ss2, ps2 = nm[11], nm[12], ks[12], ss[12], ps[12]
		cnn.add_module('residualBlock{0}'.format(1112), ResidualBlock(nIn1, nOut1, ks1, ss1, ps1,
																	  nIn2, nOut2, ks2, ss2, ps2,
																	))
		cnn.add_module('pooling{0}'.format(3), nn.MaxPool2d(
			(2, 2), stride=(2, 1), padding=(0, 1)))

		nIn1, nOut1, ks1, ss1, ps1 = nm[12], nm[13], ks[13], ss[13], ps[13]
		nIn2, nOut2, ks2, ss2, ps2 = nm[13], nm[14], ks[14], ss[14], ps[14]
		downsample = nn.Sequential(nn.Conv2d(nIn1, nOut2, 1, 1, 0))
		cnn.add_module('residualBlock{0}'.format(1314), ResidualBlock(nIn1, nOut1, ks1, ss1, ps1,
																	  nIn2, nOut2, ks2, ss2, ps2,
																	  downsample,
																	  att_type=att_type))
		nIn1, nOut1, ks1, ss1, ps1 = nm[14], nm[15], ks[15], ss[15], ps[15]
		nIn2, nOut2, ks2, ss2, ps2 = nm[15], nm[16], ks[16], ss[16], ps[16]
		cnn.add_module('residualBlock{0}'.format(1516), ResidualBlock(nIn1, nOut1, ks1, ss1, ps1,
																	  nIn2, nOut2, ks2, ss2, ps2,
																	  att_type=att_type))
		cnn.add_module('pooling{0}'.format(4), nn.MaxPool2d(
			(2, 2), stride=(2, 1), padding=(0, 1)))

		convRelu(17, True)
		self.cnn = cnn
		self.rnn = nn.Sequential(
			BidirectionalLSTM(512, 256, 256),
			BidirectionalLSTM(256, 256, nclass))

	def forward(self, input):
		# for i, layer in enumerate(self.cnn):
		#     print(layer)
		#     print('Input: ', input.size())
		#     input = layer(input)
		#     print('output: ', input.size())
		#     print('________________________________________')
		conv = self.cnn(input)
		b, c, h, w = conv.size()
		# print(input.size(), h, w)
		assert h == 1, "the height of conv must be 1"
		conv = conv.squeeze(2)
		conv = conv.permute(2, 0, 1)  # [w, b, c]

		# rnn features
		output = self.rnn(conv)

		return output

if __name__ == "__main__":
	tbatch = torch.randn(64, 1, 96, 256)
	crnn = CRNN(96, 1, 100, 256, att_type=None)
	output = crnn(tbatch)
	print("output size in res_crnn==>", output.size())
