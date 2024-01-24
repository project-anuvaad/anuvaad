import argparse
import os

import cv2
import lmdb
import numpy as np


def checkImageIsValid(imageBin):
	
	if imageBin is None:
		print("empty imageBin")
		return False
	imageBuf = np.frombuffer(imageBin, dtype=np.uint8)
	length1 = len(imageBuf)
	if length1 > 0:
		img = cv2.imdecode(imageBuf, cv2.IMREAD_GRAYSCALE)
		imgH, imgW = img.shape[0], img.shape[1]
		if imgH * imgW == 0:
			return False
	else:
		return False

	return True


def writeCache(env, cache):
	
	with env.begin(write=True) as txn:
		for k, v in cache.items():
			if type(v) == bytes:
				txn.put(str(k).encode(),v)
			else:
				txn.put(str(k).encode(), str(v).encode())

def createDataset(outputPath='/lmdb', parentDirofImages='/data'):
	"""
	Create LMDB dataset for CRNN training.

	ARGS:
	outputPath        : LMDB output path
	parentDirofImages : the path which would be prefixed with the images path
	"""
	imagePathList = os.listdir(parentDirofImages)
	try:
		imagePathList = sorted(imagePathList, key=lambda x:int(x.strip().split('.')[0]))
	except:
		imagePathList.sort()
	labelnameList = imagePathList.copy()
		
	nSamples = len(imagePathList)
	print(nSamples)
	print("imagepathlist and labelnamelist", len(imagePathList), len(labelnameList) ) 
	assert(len(imagePathList) == len(labelnameList))
	
	env = lmdb.open(outputPath, map_size=1099511627776)
	cache = {}
	cnt = 1
	
	for i in range(nSamples):
		imagePath = os.path.join(parentDirofImages,imagePathList[i])
		label = labelnameList[i].strip()

		if not os.path.exists(imagePath):
			print('%s does not exist' % imagePath)
			continue
		with open(imagePath, 'rb') as f:
			imageBin = f.read()
		if not checkImageIsValid(imageBin):
			print('%s is not a valid image' % imagePath)
			continue

		imageKey = 'image-%09d' % cnt
		labelKey = 'label-%09d' % cnt
		
		cache[imageKey] = imageBin
		cache[labelKey] = label
		
		if cnt % 1000 == 0:
			writeCache(env, cache)
			cache = {}
			print('Written %d / %d' % (cnt, nSamples))
		
		cnt += 1
	
	nSamples = cnt-1
	cache['num-samples'] = str(nSamples)
	writeCache(env, cache)
	print('Created dataset with %d samples' % nSamples)

if __name__=="__main__":
    pass
	# parser = argparse.ArgumentParser()
	# parser.add_argument('--out', type = str, required = True, help = 'lmdb data output path')
	# parser.add_argument('--folder', type = str, help = 'path to folder which contains the images')
	# args = parser.parse_args()

	# output_path = '/home/ajoy/0_ajoy_experiments/handwritten/5_code/2_version/2_strcnn_santoshini/testing/lmdb'
	# parentDirofImages = '/home/ocr/images'
	
	# createDataset(args.out, args.folder)
	# createDataset()