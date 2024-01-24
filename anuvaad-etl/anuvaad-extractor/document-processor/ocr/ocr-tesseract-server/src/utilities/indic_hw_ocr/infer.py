import json
import os
from tempfile import TemporaryDirectory
from os.path import join
import argparse
import sys
from create_lmdb import createDataset


def main(args):
	modality = 'printed'
	lang = args.language
	lmdb_dir = TemporaryDirectory(prefix='lmdb')
	out_dir = TemporaryDirectory(prefix='out')

	# creating LMDB dataset
	createDataset(lmdb_dir.name, args.test_dir)
	command = [
		join(args.venv_path, 'bin/python') + ' lang_train.py',
		'--mode test',
		'--lang {}'.format(lang),
		'--pretrained ' + join(args.model_dir, 'out/crnn_results/best_cer.pth'),
		f'--valRoot {lmdb_dir.name}',
		f'--out {out_dir.name}',
		'--cuda --adadelta'
	]
	os.system(' '.join(command))
	with open(join(args.out_dir, 'test_gt_and_predicted_text.txt'), 'r') as f:
		b = f.readlines()
	a = []
	for i in b:
		x = i.strip().split('\t')[-1].strip()
		if x.endswith('.jpg'):
			x = ''
		a.append(x)
	b = os.listdir(args.test_dir)
	try:
		b = sorted(b, key=lambda x:int(x.strip().split('.')[0]))
	except:
		b.sort()
	ret = {}
	for i in range(len(b)):
		try:
			ret[b[i]] = a[i]
		except:
			ret[b[i]] = ''
	with open(join(args.out_dir, 'out.json'), 'w', encoding='utf-8') as f:
		f.write(json.dumps(ret, indent=4))

if __name__ == '__main__':
	parser = argparse.ArgumentParser(description='Printed OCR')
	parser.add_argument('--model_dir', type=str, help='Path to pretrained model directory')
	parser.add_argument('--test_dir', type=str, help='Path to input images directory')
	parser.add_argument('--out_dir', type=str, help='Path to directory where to store the JSON OCR output')
	parser.add_argument('--language', type=str, help='Language of the input images')
	parser.add_argument('--venv_path', type=str, help='Path to the virtual env of python')
	args = parser.parse_args()

	main(args)