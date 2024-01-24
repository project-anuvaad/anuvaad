from PIL import Image, ImageOps
import numpy as np

"""
Creates an augmented image by applying Random warp grid distortion.
This is based on/inspired by

Wigington, Curtis, et al. 
"Data Augmentation for Recognition of Handwritten Words and Lines Using a CNN-LSTM Network." 
Document Analysis and Recognition (ICDAR), 2017 14th IAPR International Conference on. 
Vol. 1. IEEE, 2017.

"""

class GD(object):
    def __init__(self, prob=0.7, gridsize=(26, 26), deviation=1.7):
        self.probability = prob
        self.gridsize = gridsize
        self.deviation = deviation

    def __call__(self, sample):
        image = sample
        if np.random.rand() < self.probability:
            image = _warp(image, self.gridsize, self.deviation)
        return image

def RandomWarpGridDistortion(images, count, gridsize, deviation):
    new_images = []
    for image in images:
        new_images.extend([_warp(image, gridsize, deviation)
                           for i in range(count)])
    images.extend(new_images)
    return images


def _warp(img, gridsize=None, deviation=None, mat=None, return_mat=False):
    gridsize = gridsize or (26, 26)
    deviation = deviation or 10
    (w, h) = img.size

    num_x = w // gridsize[0] + 1
    num_y = h // gridsize[1] + 1

    mat = mat if mat is not None else np.random.normal(
        scale=deviation, size=(num_y + 1, num_x + 1, 2))

    mesh = []
    for x in range(num_x):
        for y in range(num_y):
            target = (x * gridsize[0], y * gridsize[0],
                      (x + 1) * gridsize[0], (y + 1) * gridsize[0])
            nw_y = y * gridsize[0] + mat[y, x, 0]
            nw_x = x * gridsize[0] + mat[y, x, 1]

            sw_y = (y + 1) * gridsize[0] + mat[y + 1, x, 0]
            sw_x = x * gridsize[0] + mat[y + 1, x, 1]

            se_y = (y + 1) * gridsize[0] + mat[y + 1, x + 1, 0]
            se_x = (x + 1) * gridsize[0] + mat[y + 1, x + 1, 1]

            ne_y = y * gridsize[0] + mat[y, x + 1, 0]
            ne_x = (x + 1) * gridsize[0] + mat[y, x + 1, 1]

            source = (nw_x, nw_y, sw_x, sw_y, se_x, se_y, ne_x, ne_y)

            mesh.append((target, source))

    img_transformed = img.transform(
        img.size,
        method=Image.MESH,
        data=mesh,
        fillcolor=255)

    if return_mat:
        return img_transformed, mat
    else:
        return img_transformed
