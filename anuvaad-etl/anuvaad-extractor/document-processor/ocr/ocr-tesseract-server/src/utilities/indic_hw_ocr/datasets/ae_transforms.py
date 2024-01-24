import torch
import cv2
import numpy as np

from skimage.transform import PiecewiseAffineTransform, warp
from scipy.ndimage.interpolation import map_coordinates
from scipy.ndimage.filters import gaussian_filter
from skimage import io, transform
from PIL import Image

class Rescale(object):
    """Rescale the image in a sample to a given size.

    Args:
        output_size (tuple or tuple): Desired output size. If tuple, output is
            matched to output_size. If int, smaller of image edges is matched
            to output_size keeping aspect ratio the same.
    """

    def __init__(self, output_size, keep_ratio=False):
        self.output_size = output_size
        self.keep_ratio = keep_ratio

    def __call__(self, sample):
        image = sample
        image = np.array(image)

        h, w = image.shape[:2]
        if isinstance(self.output_size, int):
            new_h, new_w = self.output_size, self.output_size * w / h
            new_h, new_w = int(new_h), int(new_w)
            img = cv2.resize(image,(new_w, new_h))
        else:
            if self.keep_ratio:
                ratio = w/h
                img_h, img_w = self.output_size
                new_h = img_h
                new_w = min(img_w, new_h * ratio)
                new_h, new_w = int(new_h), int(new_w)
                img = cv2.resize(image,(new_w, new_h))
                pad = img_w - new_w
                # img = np.pad(img, ((0, 0),(0, pad)), 'maximum')
                img = np.pad(img, ((0, 0),(0, pad)), 'constant', constant_values=(255, ))
            else:
                new_h, new_w = self.output_size
                new_h, new_w = int(new_h), int(new_w)
                img = cv2.resize(image,(new_w, new_h))
        # print(img.shape)
        # img = Image.fromarray(img)
        return img

class ElasticTransformation(object):
    """ElasticTransformation the image in a sample to a given size.
    Code adapted from https://www.kaggle.com/bguberfain/elastic-transform-for-data-augmentation

    Reducing sigma increases distortion
    increasing alpha increases distortion
    """
    def __init__(self, prob, alpha=0.3, sigma=0.04, borderValue=255):
        self.prob = prob
        self.borderValue = borderValue
        self.sigma = sigma
        self.alpha = alpha

    def __call__(self, sample):

        image = np.array(sample)

        if(np.random.rand()>self.prob):
            return image
        alpha = image.shape[0]*self.alpha
        sigma = image.shape[0]*self.sigma
        random_state = None

        if random_state is None:
            random_state = np.random.RandomState(None)

        shape = image.shape
        shape_size = shape[:2]
        dx = gaussian_filter((random_state.rand(*shape) * 2 - 1), sigma, mode='reflect',
                                         cval=self.borderValue) * alpha
        dy = gaussian_filter((random_state.rand(*shape) * 2 - 1), sigma, mode='reflect',
                                         cval=self.borderValue) * alpha

        x, y = np.meshgrid(np.arange(shape[1]), np.arange(shape[0]))
        indices = np.reshape(y+dy, (-1, 1)), np.reshape(x+dx, (-1, 1))

        newimage = map_coordinates(image, indices, order=1, mode='constant',
                                         cval=self.borderValue).reshape(shape)
        return newimage



class AffineTransformation(object):
    """AffineTransformation
    """
    def __init__(self, prob, rotate=2, shear=0.5, borderValue=255):
        self.prob = prob
        self.borderValue = borderValue
        self.rotate = rotate
        self.shear = shear
        assert shear <= 1, 'Max shear value is 1'

    def __call__(self, sample):
        image = np.array(sample)

        if(np.random.rand()>self.prob):
            return Image.fromarray(image)

        rows, cols = image.shape
        if(np.random.rand()<0.5):
            rotAngle = np.random.randint(-self.rotate, self.rotate)

            height, width = image.shape[:2]
            image_center = (width/2, height/2)

            rotation_mat = cv2.getRotationMatrix2D(image_center, rotAngle, 1.)

            abs_cos = abs(rotation_mat[0,0])
            abs_sin = abs(rotation_mat[0,1])

            bound_w = int(height * abs_sin + width * abs_cos)
            bound_h = int(height * abs_cos + width * abs_sin)

            rotation_mat[0, 2] += bound_w/2 - image_center[0]
            rotation_mat[1, 2] += bound_h/2 - image_center[1]

            image = cv2.warpAffine(image, rotation_mat, (bound_w, bound_h), borderMode=cv2.BORDER_CONSTANT, borderValue=self.borderValue)

        if(np.random.rand()<0.5):
            shearAngle = -self.shear + np.random.rand()
            M = np.array([[1.0,shearAngle,0.0],[0.0,1.0,0.0]])
            image = cv2.warpAffine(image, M, (cols,rows), borderMode=cv2.BORDER_CONSTANT, borderValue=self.borderValue)
        image = cv2.resize(image,(cols,rows))
        return Image.fromarray(image)


class MultiScale(object):
    def __init__(self, prob, scale_axis=2, scale_factor=2):
        self.prob = prob
        self.scale_axis = scale_axis
        self.scale_factor = scale_factor

    def __call__(self, sample):
        image = sample
        h, w = image.shape
        if np.random.rand()>self.prob:
            return image

        colors_ = np.unique(image)
        if np.max(colors_) >= 170:
            color = colors_[colors_>=170].mean()
        else:
            color = 255
        color = 255
        nw = w
        nh = h
        if self.scale_axis == 0 or self.scale_axis == 2:
            nw = w//(2**np.random.randint(1, self.scale_factor))
        if self.scale_axis == 1 or self.scale_axis == 2:
            nh = h//(2**np.random.randint(1, self.scale_factor))

        rimage = cv2.resize(image, (nw, nh))
        image = color*np.ones((h, w))
        # print(image.shape, rimage.shape)
        if self.scale_axis == 2:
            nx = np.random.randint(3, w-nw)
            ny = np.random.randint(3, h-nh)
            image[ny:ny+nh, nx:nx+nw] = rimage
        elif self.scale_axis == 0:
            nx = np.random.randint(3, w-nw)
            image[0:h, nx:nx+nw] = rimage
        elif self.scale_axis == 1:
            ny = np.random.randint(3, h-nh)
            image[ny:ny+nh, 0:w] = rimage
        return image

class PiecewiseAffine(object):
    def __init__(self, prob, dfactor=10, pfactor=(0, 2)):
        self.prob = prob
        self.dfactor = dfactor
        self.pfactor = pfactor

    def __call__(self, sample):
        image = sample
        if np.random.rand()>self.prob:
            return image

        image = np.array(image)
        rows, cols = image.shape[0], image.shape[1]
        src_cols = np.linspace(0, cols, 4)
        src_rows = np.linspace(0, rows, 2)
        src_rows, src_cols = np.meshgrid(src_rows, src_cols)
        src = np.dstack([src_cols.flat, src_rows.flat])[0]

        dfactor = np.random.randint(10, 20)
        pfactor = (np.random.randint(0, 3), np.random.randint(2, 4))
        dst_rows = src[:, 1] - np.sin(np.linspace(pfactor[0]*np.pi/2, pfactor[1]*np.pi, src.shape[0]))*dfactor
        dst_cols = src[:, 0]
        dst = np.vstack([dst_cols, dst_rows]).T

        tform = PiecewiseAffineTransform()
        tform.estimate(src, dst)
        out_image = warp(image, tform, output_shape=(rows, cols), cval=255, preserve_range=True)
        out_image = Image.fromarray(np.uint8(out_image))
        return out_image


class Normalize(object):
    """Convert ndarrays in sample to Tensors."""

    def __call__(self, sample):
        image = sample
        image = (image-np.mean(image)) / ((np.std(image) + 0.0001) / 128.0)

        return image

class ColorInvert(object):
    """Convert ndarrays in sample to Tensors."""
    def __init__(self, prob=0.5):
        self.prob = prob

    def __call__(self, sample):
        image = sample

        if np.random.rand()>self.prob:
            return image

        cnst = 255
        image = cnst - image
        return image

class ToTensor(object):
    """Convert arrays in sample to Tensors."""

    def __call__(self, sample):
        image = np.array(sample)
        image = torch.from_numpy(np.array(image))
        image = image.float().sub(128).div(128)
        image = image.unsqueeze(0)
        return image

class NormalizedTensor(object):
    def __call__(self, sample):
        image = np.array(sample)
        image = torch.from_numpy(np.array(image, dtype=np.double))
        image.sub_(0.5).div_(0.5)
        image = image.unsqueeze(0)
        return image
