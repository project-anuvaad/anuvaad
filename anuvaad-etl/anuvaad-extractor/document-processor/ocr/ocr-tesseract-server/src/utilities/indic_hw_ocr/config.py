from __future__ import print_function
from __future__ import division

import argparse
import random
import os
import numpy as np
import torch
import torch.backends.cudnn as cudnn

parser = argparse.ArgumentParser()
parser.add_argument('--mode', type=str, default='train',
                    choices=['train', 'test'])
parser.add_argument('--trainRoot', help='path to dataset')
parser.add_argument('--valRoot', help='path to dataset')
parser.add_argument('--out', type=str, default="out/temp.txt", help='predictions file')
#parser.add_argument('--test_output', type=str, default="test_output/temp.txt", help='predictions file')
parser.add_argument('--lang', help='path to dataset')

# dataset & model
parser.add_argument('--alphabet', type=str, default='0123456789abcdefghijklmnopqrstuvwxyz*')
parser.add_argument('--alphabet_type', type=str, default='string', choices=['string', 'file'])
parser.add_argument('--keep_ratio', action='store_true', help='whether to keep ratio for image resize')
parser.add_argument('--lowercase', action='store_true', help='all labels converted to lowercase')
parser.add_argument('--alphanumeric', action='store_true', help='all labels converted to alphanumeric')
parser.add_argument('--max_length', type=int, default=32, help='max label length')


parser.add_argument('--pretrained', default='', help="path to pretrained model (to continue training)")
parser.add_argument('--transfer', action='store_true', help='whether to transfer weights')
parser.add_argument('--imgH', type=int, default=96, help='the height of the input image to network')
parser.add_argument('--imgW', type=int, default=256, help='the width of the input image to network')
parser.add_argument('--nh', type=int, default=256, help='size of the lstm hidden state')
parser.add_argument('--arch', type=str, default='ResCRNN', choices=['CRNN', 'ResCRNN'])
parser.add_argument('--beamdecoder', action='store_true', help='whether to use CTC beam decoder')


# STN params
parser.add_argument('--STN_type', type=str, default='Affine', choices=['TPS', 'Affine', 'None'])
parser.add_argument('--tps_inputsize', nargs='+', type=int, default=[32, 64])
parser.add_argument('--tps_outputsize', nargs='+', type=int,
                    default=[32, 100], help='add the stn head.')
parser.add_argument('--tps_margins', nargs='+',
                    type=float, default=[0.05, 0.05])
parser.add_argument('--stn_activation', type=str, default='none')
parser.add_argument('--num_control_points', type=int, default=20)
parser.add_argument('--stn_with_dropout', action='store_true', default=False)
parser.add_argument('--stn_nc', type=int, default=1)
parser.add_argument('--nheads', type=int, default=1)


# CNN params
parser.add_argument('--cnn_nc', type=int, default=1)

# training params
parser.add_argument('--workers', type=int, help='number of data loading workers', default=2)
parser.add_argument('--batchSize', type=int, default=64, help='input batch size')
parser.add_argument('--nepoch', type=int, default=150, help='number of epochs to train for')
parser.add_argument('--cuda', action='store_true', help='enables cuda')
parser.add_argument('--gpu_id', type=str, default='0', help='gpu device ids')
parser.add_argument('--node_dir', default='out/crnn_results', help='Where to store samples and models')
parser.add_argument('--expr_dir', default='out/crnn_results/', help='Where to store samples and models')
parser.add_argument('--displayInterval', type=int, default=20, help='Interval to be displayed')
parser.add_argument('--n_test_disp', type=int, default=10, help='Number of samples to display when test')
parser.add_argument('--valInterval', type=int, default=5, help='Interval to be displayed')
parser.add_argument('--saveInterval', type=int, default=50000, help='Interval to be displayed')
parser.add_argument('--val1_iter', type=int, default=80, help='Number of train data batches that will be validated')
parser.add_argument('--val2_iter', type=int, default=np.inf, help='Number of val data batches that will be validated')

parser.add_argument('--lr', type=float, default=0.00001, help='learning rate for Critic, not used by adadealta')
parser.add_argument('--beta1', type=float, default=0.00005, help='beta1 for adam. default=0.5')
parser.add_argument('--momentum', type=float, default=0.09, help='momentum for sgd')
parser.add_argument('--adam', action='store_true', help='Whether to use adam (default is rmsprop)')
parser.add_argument('--adadelta', action='store_true', help='Whether to use adadelta (default is rmsprop)')
parser.add_argument('--StepLR', action='store_true', help='Whether to use scheduler')
parser.add_argument('--rmsprop', action='store_true', help='Whether to rmsprop')
parser.add_argument('--manualSeed', type=int, default=1234, help='reproduce experiemnt')
parser.add_argument('--random_sample', action='store_true', help='whether to sample the dataset with random sampler')
parser.add_argument('--use_tb', action='store_true', help='whether to use tensorboard logging')

opt = parser.parse_args()
