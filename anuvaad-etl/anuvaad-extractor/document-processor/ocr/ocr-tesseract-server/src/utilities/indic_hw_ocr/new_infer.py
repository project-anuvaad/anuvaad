from __future__ import division, print_function

import random
import numpy as np
import torch
import torch.nn.functional as F
import torch.utils.data
from torchvision.transforms import Compose

import src.utilities.indic_hw_ocr.datasets.dataset as dataset
import src.utilities.indic_hw_ocr.utils
from src.utilities.indic_hw_ocr.datasets.ae_transforms import *
from src.utilities.indic_hw_ocr.datasets.imprint_dataset import Rescale as IRescale
from src.utilities.indic_hw_ocr.models.model import ModelBuilder

random.seed(1234)
np.random.seed(1234)
torch.manual_seed(1234)

class BaseHTR(object):
    def __init__(self, test_root, alphabet, pretrained, out_dir, language):
        self.test_root = test_root
        self.alphabet = alphabet
        self.pretrained = pretrained
        self.out_dir = out_dir
        self.language = language

        self.test_transforms = Compose([
            IRescale(max_width=256, height=96),
            ToTensor()
        ])
        self.identity_matrix = torch.tensor(
            [1, 0, 0, 0, 1, 0],
            dtype=torch.float
        )

        self.test_data = dataset.ImageDataset(
            root=self.test_root,
            voc=self.alphabet,
            transform=self.test_transforms,
            voc_type='file',
            return_list=True
        )
        self.converter = src.utilities.indic_hw_ocr.utils.strLabelConverter(
            self.test_data.id2char,
            self.test_data.char2id,
            self.test_data.ctc_blank
        )
        self.nclass = self.test_data.rec_num_classes

        crnn = ModelBuilder(
            96, 256,
            [48, 128], [96, 256],
            20, [0.05, 0.05],
            'none',
            256, 1, 1,
            self.nclass,
            STN_type='TPS',
            nheads=1,
            stn_attn=None,
            use_loc_bn=False,
            loc_block='LocNet',
            CNN='ResCRNN'
        )
        crnn = torch.nn.DataParallel(crnn, device_ids=None)  # You might want to set device_ids based on your setup
        crnn.load_state_dict(torch.load(self.pretrained, map_location=torch.device('cpu')))
        self.model = crnn
        self.model.eval()
        print('Model loading complete')

        self.init_variables()
        # print('Classes: ', self.test_data.voc)
        print('#Test Samples: ', self.test_data.nSamples)

    def init_variables(self):
        self.image = torch.FloatTensor(64, 3, 96, 256)
        self.text = torch.LongTensor(64 * 5)
        self.length = torch.LongTensor(64)

    def get_decoded_preds(self):
        gts = []
        decoded_preds = []

        data_loader = torch.utils.data.DataLoader(
            self.test_data,
            batch_size=64,
            num_workers=2,
            collate_fn=dataset.collatedict(),
            drop_last=False
        )

        val_iter = iter(data_loader)
        max_iter = min(np.inf, len(data_loader))

        with torch.no_grad():
            for i in range(max_iter):
                cpu_images, cpu_texts = next(val_iter)
                src.utilities.indic_hw_ocr.utils.loadData(self.image, cpu_images)
                output_dict = self.model(self.image)
                batch_size = cpu_images.size(0)

                preds = F.log_softmax(output_dict['probs'], 2)
                preds_size = torch.IntTensor([preds.size(0)] * batch_size)
                _, preds = preds.max(2)
                preds = preds.transpose(1, 0).contiguous().view(-1)
                decoded_pred = self.converter.decode(preds.data, preds_size.data, raw=False)

                gts += list(cpu_texts)
                decoded_preds += list(decoded_pred)

        return decoded_preds

    @staticmethod
    def run_handwritten_ocr(test_root, alphabet, pretrained, out_dir, language):
        htr = BaseHTR(test_root, alphabet, pretrained, out_dir, language)
        decoded_preds = htr.get_decoded_preds()
        return decoded_preds
