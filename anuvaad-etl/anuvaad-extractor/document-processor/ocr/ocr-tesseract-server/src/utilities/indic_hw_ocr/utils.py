#!/usr/bin/python
# encoding: utf-8

import torch
import torch.nn as nn
from torch.autograd import Variable
import collections
import numpy as np
import pdb
import unicodedata
from PIL import Image, ImageFont, ImageDraw
import cv2
import re

class strLabelConverter(object):

	def __init__(self, id2char, char2id, ctc_blank,
				 add_blank=True, use_NFKD=False):
		self.id2char = id2char
		self.char2id = char2id
		self.ctc_blank = ctc_blank
		self.add_blank = add_blank
		self.use_NFKD = use_NFKD

	def encode(self, text):
		#print("charlist==>",self.id2char)
		if isinstance(text, str):
			if self.use_NFKD:
				text = unicodedata.normalize('NFKD', text)
			entext = []
			for i, char in enumerate(text):
				if i>0 and char==text[i-1] and self.add_blank:             #need to check for new charlist
					entext.append(self.char2id[self.ctc_blank])
				try:
					entext.append(self.char2id[char])
				except:
					continue
			length = [len(entext)]
		####################################################
		#print
		#print("charlist ==>", self.id2char)
		#print("charlist after ==>", extext)
		####################################################
		#including all character in input text
		#*for i, char in enumerate(text):
		#*	char = text[i]
		#*	try:
		#*		entext.append(self.char2id[char])
		#*	except:
		#*		continue
		#*length = [len(entext)]
		#######################################################	
		elif isinstance(text, collections.abc.Iterable):
			entext = []
			length = []
			for s in text:
				# print(s)
				t, l = self.encode(s)
				entext += t
				length += l
			entext, length = (torch.IntTensor(entext), torch.IntTensor(length))
		#print("text and charlist after ==>", text, entext)
		return entext, length

	def decode(self, t, length, raw=False): 
		if length.numel() == 1:   #check for single test image 
			length = length[0]
			assert t.numel() == length, "text with length: {} does not match declared length: {}".format(t.numel(), length)
			if raw:
				char_list = []
				for i in range(length):
					if t[i] != 0:
						char_list.append(self.id2char[t[i].item()])
					else:
						char_list.append('~')
				return ''.join(char_list)
			else:
				char_list = []
				for i in range(length):
					if t[i] != 0 and (not (i > 0 and t[i - 1] == t[i])):
						char_list.append(self.id2char[t[i].item()])
				return ''.join(char_list)
		else:
			# batch mode
			assert t.numel() == length.sum(), "texts with length: {} does not match declared length: {}".format(t.numel(), length.sum())
			texts = []
			index = 0
			for i in range(length.numel()):
				l = length[i]
				texts.append(
					self.decode(
						t[index:index + l], torch.IntTensor([l]), raw=raw))
				index += l
			return texts


class strLineLabelConverter(object):

	def __init__(self, id2char, char2id, ctc_blank,
				 add_blank=True, use_NFKD=False):
		self.id2char = id2char
		self.char2id = char2id
		self.ctc_blank = ctc_blank
		self.use_NFKD = use_NFKD

	def encode(self, text, max_length=100):
		if isinstance(text, str):
			assert len(text) <= max_length, "Input length greater than allowed max length"
			if self.use_NFKD:
				text = unicodedata.normalize('NFKD', text)
			entext = [self.char2id[self.ctc_blank] for i in range(max_length)]
			text = [self.char2id[char] for char in list(text)]
			entext[:len(text)] = text
			length = [max_length]
		elif isinstance(text, collections.Iterable):
			entext = []
			length = []
			for s in text:
				t, l = self.encode(s, max_length)
				entext += t
				length += l
			entext, length = (torch.IntTensor(entext), torch.IntTensor(length))
		return entext, length

	def decode(self, t, length, raw=False):
		if length.numel() == 1:
			length = length[0]
			assert t.numel() == length, "text with length: {} does not match declared length: {}".format(t.numel(), length)
			if raw:
				char_list = []
				for i in range(length):
					if t[i] != 0:
						char_list.append(self.id2char[t[i].item()])
					else:
						char_list.append('~')
				return ''.join(char_list)
			else:
				char_list = []
				for i in range(length):
					if t[i] != 0 and (not (i > 0 and t[i - 1] == t[i])):
						char_list.append(self.id2char[t[i].item()])
				return ''.join(char_list)
		else:
			# batch mode
			assert t.numel() == length.sum(), "texts with length: {} does not match declared length: {}".format(t.numel(), length.sum())
			texts = []
			index = 0
			for i in range(length.numel()):
				l = length[i]
				texts.append(
					self.decode(
						t[index:index + l], torch.IntTensor([l]), raw=raw))
				index += l
			return texts


class AttnLabelConverter(object):
	""" Convert between text-label and text-index """

	def __init__(self, character):
		# character (str): set of the possible characters.
		# [GO] for the start token of the attention decoder. [s] for end-of-sentence token.
		list_token = ['[GO]', '[s]']  # ['[s]','[UNK]','[PAD]','[GO]']
		list_character = list(character)
		self.character = list_token + list_character

		self.dict = {}
		for i, char in enumerate(self.character):
			# print(i, char)
			self.dict[char] = i

	def encode(self, text, batch_max_length=25):
		length = [len(s) + 1 for s in text]  # +1 for [s] at end of sentence.
		# batch_max_length = max(length) # this is not allowed for multi-gpu setting
		batch_max_length += 1
		# additional +1 for [GO] at first step. batch_text is padded with [GO] token after [s] token.
		batch_text = torch.LongTensor(len(text), batch_max_length + 1).fill_(0)
		for i, t in enumerate(text):
			text = list(t)
			text.append('[s]')
			text = [self.dict[char] for char in text]
			batch_text[i][1:1 + len(text)] = torch.LongTensor(text)  # batch_text[:, 0] = [GO] token
		return (batch_text, torch.IntTensor(length))

	def decode(self, text_index, length):
		""" convert text-index into text-label. """
		texts = []
		for index, l in enumerate(length):
			text = ''.join([self.character[i] for i in text_index[index, :]])
			texts.append(text)
		return texts


class averager(object):
	"""Compute average for `torch.Variable` and `torch.Tensor`. """

	def __init__(self):
		self.reset()

	def add(self, v):
		if isinstance(v, Variable):
			count = v.data.numel()
			v = v.data.sum()
		elif isinstance(v, torch.Tensor):
			count = v.numel()
			v = v.sum()

		self.n_count += count
		self.sum += v

	def reset(self):
		self.n_count = 0
		self.sum = 0

	def val(self):
		res = 0
		if self.n_count != 0:
			res = self.sum / float(self.n_count)
		return res

def get_vocabulary(voc, voc_type, lowercase, alphanumeric, EOS=None, PADDING=None,
				   UNKNOWN=None):
	if voc_type == 'string':
		voc = list(voc)
	else:
		voc_file = voc
		voc = list()
		with open('src/utilities/indic_hw_ocr/alphabet/{}'.format(voc_file)) as f:
			for line in f:
				ch = line[:-1]
				# ch = unicodedata.normalize('NFKD', line[:-1])
				# if ch!=line[:-1]:
				#     print(line[:-1], ch)
				#print("ch ==>",ch)
				if not lowercase:
					voc.append(ch)
				else:
					voc.append(ch.lower())

				if alphanumeric:
					voc = list(voc)                 #check for line level recognizer
	voc = list(dict.fromkeys(voc))
	if EOS:
		voc.append(EOS)
	if PADDING:
		voc.append(PADDING)
	if UNKNOWN:
		voc.append(UNKNOWN)
	#print("voc==>",voc)    
	return voc


def add_border(src):
	src = cv2.cvtColor(src,cv2.COLOR_GRAY2RGB)
	borderType = cv2.BORDER_CONSTANT
	value = (255, 0, 0)
	dst = cv2.copyMakeBorder(src, 1, 1, 1, 1, borderType, None, value)
	return dst

def to_numpy(tensor):
	if torch.is_tensor(tensor):
		return tensor.cpu().numpy()
	elif type(tensor).__module__ != 'numpy':
		raise ValueError("Cannot convert {} to numpy array".format(
						  type(tensor)))
	return tensor


def to_torch(ndarray):
	if type(ndarray).__module__ == 'numpy':
		return torch.from_numpy(ndarray)
	elif not torch.is_tensor(ndarray):
		raise ValueError("Cannot convert {} to torch tensor".format(
						  type(ndarray)))
	return ndarray

def oneHot(v, v_length, nc):
	batchSize = v_length.size(0)
	maxLength = v_length.max()
	v_onehot = torch.FloatTensor(batchSize, maxLength, nc).fill_(0)
	acc = 0
	for i in range(batchSize):
		length = v_length[i]
		label = v[acc:acc + length].view(-1, 1).long()
		v_onehot[i, :length].scatter_(1, label, 1.0)
		acc += length
	return v_onehot

def loadData(v, data):
	v.resize_(data.size()).copy_(data)

def prettyPrint(v):
	print('Size {0}, Type: {1}'.format(str(v.size()), v.data.type()))
	print('| Max: %f | Min: %f | Mean: %f' % (v.max().data[0], v.min().data[0],
											  v.mean().data[0]))
def assureRatio(img):
	"""Ensure imgH <= imgW."""
	b, c, h, w = img.size()
	if h > w:
		main = nn.UpsamplingBilinear2d(size=(h, h), scale_factor=None)
		img = main(img)
	return img

def levenshtein(seq1, seq2):
	size_x = len(seq1) + 1
	size_y = len(seq2) + 1
	matrix = np.zeros ((size_x, size_y))
	for x in range(size_x):
		matrix [x, 0] = x
	for y in range(size_y):
		matrix [0, y] = y

	for x in range(1, size_x):
		for y in range(1, size_y):
			if seq1[x-1] == seq2[y-1]:
				matrix [x,y] = min(
					matrix[x-1, y] + 1,
					matrix[x-1, y-1],
					matrix[x, y-1] + 1
				)
			else:
				matrix [x,y] = min(
					matrix[x-1,y] + 1,
					matrix[x-1,y-1] + 1,
					matrix[x,y-1] + 1
				)
	return (matrix[size_x - 1, size_y - 1])


def synthesizeImage(rText, shape):
	fontsize = 64
	font = ImageFont.truetype(font_path, fontsize)
	w, h = font.getsize(rText)

	if (w>384):
		font = ImageFont.truetype(font_path, 48)
		w, h = font.getsize(rText)
	elif(w<64):
		font = ImageFont.truetype(font_path, 96)
		w, h = font.getsize(rText)

	# if np.random.rand() > 0.3:
	#     image = Image.open(bg_path).convert('L').resize((384, 128))
	# else:
	image = Image.new('L', (384,128), 'white')

	brush = ImageDraw.Draw(image)
	brush.text((0, 0), rText, font=font, fill=0)
	return image
