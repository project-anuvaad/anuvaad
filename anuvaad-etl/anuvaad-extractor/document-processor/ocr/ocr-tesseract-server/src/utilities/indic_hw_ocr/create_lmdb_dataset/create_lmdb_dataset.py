import os
import lmdb 
import cv2
import numpy as np
import argparse

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

#def createDataset(outputPath, imagePathListFile, labelNameListFile, parentDirofImages, lookupFile, lexiconList=None, checkValid=True):
def createDataset(outputPath, imagePathListFile, labelNameListFile, parentDirofImages,checkValid=True):	

	with open(imagePathListFile) as f:
		imagePathList = f.read().strip().split("\n")#splitlines()
	with open(labelNameListFile) as f:
		labelnameList = f.read().strip().split("\n")#splitlines()
		
	nSamples = len(imagePathList)
	print(nSamples)
	print("imagepathlist and labelnamelist", len(imagePathList), len(labelnameList) ) 
	assert(len(imagePathList) == len(labelnameList))
	
	env = lmdb.open(outputPath, map_size=1099511627776)
	cache = {}
	cnt = 1
	
	for i in range(nSamples):
		#print(imagePathList[i])
		imagePath = os.path.join(parentDirofImages,imagePathList[i])
		labelString = labelnameList[i].strip()
		label = labelString.strip()

		if not os.path.exists(imagePath):
			print('%s does not exist' % imagePath)
			continue
		with open(imagePath, 'rb') as f:
			imageBin = f.read()
			#print(imageBin)
		if checkValid:
			if not checkImageIsValid(imageBin):
				print('%s is not a valid image' % imagePath)
				continue

		imageKey = 'image-%09d' % cnt
		labelKey = 'label-%09d' % cnt
		
		cache[imageKey] = imageBin
		cache[labelKey] = label
		if cnt % 50000 == 0:
			writeCache(env, cache)
			cache = {}
			print('Written %d / %d' % (cnt, nSamples))
		
		cnt += 1
	
	nSamples = cnt-1
	cache['num-samples'] = str(nSamples)
	writeCache(env, cache)
	print('Created dataset with %d samples' % nSamples)
	return nSamples

if __name__=="__main__":
	
	curr_dir = os.getcwd()
	
	parser = argparse.ArgumentParser()
	parser.add_argument('--type', help='train or val or test')
	args = parser.parse_args()
	ftype = args.type
	
	image_directory = ""
	output_path = "bengali/" + ftype + "_lmdb/"
	if not os.path.exists(output_path):
		os.makedirs(output_path)
	imagePathListFile = os.path.join('bengali/' + ftype+ '_images.txt')
	labelNameListFile = os.path.join('bengali/' + ftype+ '_labels.txt')
	parentDirofImages = image_directory
	sample = createDataset(output_path, imagePathListFile, labelNameListFile, parentDirofImages)
	
