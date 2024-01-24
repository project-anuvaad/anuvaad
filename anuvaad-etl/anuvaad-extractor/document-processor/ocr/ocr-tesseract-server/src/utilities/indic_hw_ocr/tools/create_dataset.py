import os
import lmdb # install lmdb by "pip install lmdb"
import cv2
import numpy as np
import pdb
from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
from collections import Counter
import json
import argparse

def checkImageIsValid(imageBin):
    if imageBin is None:
        return False
    imageBuf = np.fromstring(imageBin, dtype=np.uint8)
    img = cv2.imdecode(imageBuf, cv2.IMREAD_GRAYSCALE)
    imgH, imgW = img.shape[0], img.shape[1]
    if imgH * imgW == 0:
        return False
    return True


def writeCache(env, cache):
    with env.begin(write=True) as txn:
        for k, v in cache.items():
            try:
                txn.put(k.encode('ascii'), v)
            except:
                txn.put(k.encode('ascii'), v.encode())



def createDataset(outputPath, imagePathList, labelList, lexiconList=None, checkValid=True):
    """
    Create LMDB dataset for CRNN training.

    ARGS:
        outputPath    : LMDB output path
        imagePathList : list of image path
        labelList     : list of corresponding groundtruth texts
        lexiconList   : (optional) list of lexicon lists
        checkValid    : if true, check the validity of every image
    """
    assert(len(imagePathList) == len(labelList))
    nSamples = len(imagePathList)
    env = lmdb.open(outputPath, map_size=1099511627776)
    cache = {}
    cnt = 1
    for i in range(nSamples):
        imagePath = imagePathList[i]
        label = labelList[i]
        if not os.path.exists(imagePath):
            print('%s does not exist' % imagePath)
            continue
        with open(imagePath, 'rb') as f:
            # print(imagePath)
            imageBin = f.read()
        if checkValid:
            if not checkImageIsValid(imageBin):
                print('%s is not a valid image' % imagePath)
                continue

        imageKey = 'image-%09d' % cnt
        labelKey = 'label-%09d' % cnt
        fileKey = 'fname-%09d' % cnt
        cache[imageKey] = imageBin
        cache[labelKey] = label
        cache[fileKey] = imagePath
        # pdb.set_trace()
        if lexiconList:
            lexiconKey = 'lexicon-%09d' % cnt
            cache[lexiconKey] = ' '.join(lexiconList[i])
        if cnt % 1000 == 0:
            writeCache(env, cache)
            cache = {}
            print('Written %d / %d' % (cnt, nSamples))
        cnt += 1
    nSamples = cnt-1
    cache['num-samples'] = str(nSamples)
    writeCache(env, cache)
    print('Created dataset with %d samples' % nSamples)


def valid_label(label):
    alphabet = [a for a in '0123456789abcdefghijklmnopqrstuvwxyz']
    # pdb.set_trace()
    for each in label:
        if each in alphabet:
            continue
        else:
            return False
    return True


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--root_dir', type=str, required=True, help='dir path for IIIT-INDIC data')
    parser.add_argument('--save', type=str, required=True, help='destination file name and path')
    opt = parser.parse_args()

    splits = ['test', 'val', 'train']
    alphabet = set()
    for split in splits:
        img_list = []
        label_list = []
        with open(f'{opt.root_dir}/{split}.txt') as f:
            for line in f:
                path, label = line.strip().split(',')
                img_list.append(f'{opt.root_dir}'+path.strip())
                label_list.append(label.strip())
                alphabet = alphabet.union(list(label.strip()))
        outputPath = opt.save
        createDataset(outputPath, img_list, label_list, checkValid=True)

    # alphabet = sorted(alphabet)
    # with open(f"/media/data1/qrmary/iiit-indic-hw-words/bn_final3/files/char.txt", 'w') as f:
    #     f.write("\n".join(list(alphabet)))
