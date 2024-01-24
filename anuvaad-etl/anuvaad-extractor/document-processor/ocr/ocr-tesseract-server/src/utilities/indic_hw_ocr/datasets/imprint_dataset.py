from __future__ import absolute_import
from PIL import Image, ImageFile
from torch.utils.data import Dataset
import sys
from PIL import Image
import numpy as np
import pdb
import cv2
import random
import lmdb
import six
import re
import torch
from torch.utils import data
from torch.utils.data import sampler
from torchvision import transforms

from src.utilities.indic_hw_ocr.utils import get_vocabulary, to_numpy
ImageFile.LOAD_TRUNCATED_IMAGES = True


class lmdbDataset(data.Dataset):
	def __init__(self, root, voc, num_samples=np.inf,
				 label_transform=None,
				 voc_type='string', lowercase=False,
				 alphanumeric=False, ctc_blank='<b>',
				 return_list=False):
		super(lmdbDataset, self).__init__()

		self.env = lmdb.open(root, max_readers=100, readonly=True)

		assert self.env is not None, "cannot create lmdb from %s" % root
		self.txn = self.env.begin()

		self.voc = voc
		self.label_transform = label_transform
		self.nSamples = int(float(self.txn.get(b"num-samples")))
		self.nSamples = min(self.nSamples, num_samples)

		self.voc = get_vocabulary(voc, voc_type, lowercase, alphanumeric)
		self.char2id = dict(zip(self.voc, range(1, len(self.voc)+1))) 
		self.id2char = dict(zip(range(1, len(self.voc)+1), self.voc))
		self.char2id[ctc_blank] = 0
		self.id2char[0] = ctc_blank
		self.ctc_blank = ctc_blank
		self.lowercase = lowercase
		self.alphanumeric = alphanumeric
		self.rec_num_classes = len(self.id2char)
		self.return_list = return_list

	def __len__(self):
		return self.nSamples

	def __getitem__(self, index):
		assert index <= len(self), 'index range error'
		index += 1
		img_key = b'image-%09d' % index
		imgbuf = self.txn.get(img_key)

		buf = six.BytesIO()
		buf.write(imgbuf)
		buf.seek(0)
		try:
			img = Image.open(buf).convert('L')
			# img = np.array(img)
		except IOError:
			print('Corrupted image for %d' % index)
			return self[index + 1]

		label_key = b'label-%09d' % index
		word = self.txn.get(label_key).decode()

		if self.label_transform is not None:
			word = self.label_transform(word)

		# remove accented characters from labels
		#*out_of_char = f'[^{"".join(self.voc)}]'
		#*to_remove = re.search(out_of_char, word)
		#*if to_remove:
		#*   pattern = re.compile(out_of_char)
		#*   word = pattern.sub('', word)
		#*   print(out_of_char, word, to_remove)

		if self.return_list:
			return [img, word]
		return img, word


class ToTensor(object):
	"""Convert arrays in sample to Tensors."""

	def __call__(self, sample):
		image = np.array(sample)
		image = torch.from_numpy(np.array(image))
		image = image.float().sub(128).div(128)
		image = image.unsqueeze(0)
		return image

class Rescale(object):
	def __init__(self, max_width=256, height=96):
		self.max_width = max_width
		self.height = height

	def __call__(self, sample):
		image = np.array(sample)
		h, w = image.shape[:2]
		new_h = min(self.height, self.max_width*h//w)
		img = cv2.resize(image.astype('uint8'),(self.max_width, new_h))
		pad = self.height-new_h
		if pad>0:
			if pad > 10:
				pad_up = np.random.randint(1, pad//2)
				pad_down = pad-pad_up+1 if not pad//2 else pad-pad_up
			else:
				pad_up = pad
				pad_down = 0
			img = np.pad(img, ((pad_up, pad_down),(0, 0)), 'constant', constant_values=(255, ))

		return img

class collatedict(object):
	def __init__(self, transforms, opt_transforms=None):
		self.transforms = transforms
		self.opt_transforms = opt_transforms

	def __call__(self, batch):
		images, labels = zip(*batch)
		bsize = len(batch)
		nimages = []
		for i in range(bsize):
			tmp = images[i]
			if self.opt_transforms:
				tmp = self.opt_transforms(tmp)
			tmp = self.transforms(tmp)
			nimages.append(tmp)
		nimages = torch.stack(nimages)
		return nimages, labels
