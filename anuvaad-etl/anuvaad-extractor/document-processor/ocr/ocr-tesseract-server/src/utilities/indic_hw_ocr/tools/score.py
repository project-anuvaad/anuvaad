import argparse
from utils import levenshtein
import pdb
import re


def clean(label):
    alphabet = [a for a in '0123456789abcdefghijklmnopqrstuvwxyz* ']
    label = label.replace('-', '*')
    nlabel = ""
    for each in label.lower():
        if each in alphabet:
            nlabel += each
    return nlabel


parser = argparse.ArgumentParser()
parser.add_argument('--preds', type=str, default='../misc/preds/temp.txt', help='path to preds file')
parser.add_argument('--mode', type=str, default='word', help='path to preds file')
parser.add_argument('--lower', action='store_true', help='convert strings to lowercase ebfore comparison')
parser.add_argument('--alnum', action='store_true', help='convert strings to alphanumeric before comparison')
opt = parser.parse_args()

f = open(opt.preds, 'r')

tw = 0
ww = 0
tc = 0
wc = 0

if opt.mode == 'word':
	for i , line in enumerate(f):
		if i%2==0:
			pred = line.strip()
		else:
			gt = line.strip()
			if opt.lower:
				gt = gt.lower()
				pred = pred.lower()
			if opt.alnum:
				pattern = re.compile('[\W_]+')
				gt = pattern.sub('', gt)
				pred = pattern.sub('', pred)
				# pdb.set_trace()
				# gt =
			if gt != pred:
				ww += 1
				wc += levenshtein(gt, pred)
				print(f'!!{gt},{pred}, {wc}')
			tc += len(gt)
			tw += 1
else:
	for i , line in enumerate(f):
		if i%2==0:
			pred = line.strip()
		else:
			gt = line.strip()
			gt = clean(gt)
			pred = clean(pred)
			gt_w = gt.split()
			pred_w = pred.split()
			for j in range(len(gt_w)):
				try:
					if gt_w[j] != pred_w[j]:
						# print(gt_w[j], pred_w[j])
						ww += 1
				except IndexError:
					ww += 1

			tw += len(gt.split())
			wc += levenshtein(gt, pred)
			tc += len(gt)


print(ww, tw)
print('WER: ', (ww/tw)*100)
print('CER: ', (wc/tc)*100)
