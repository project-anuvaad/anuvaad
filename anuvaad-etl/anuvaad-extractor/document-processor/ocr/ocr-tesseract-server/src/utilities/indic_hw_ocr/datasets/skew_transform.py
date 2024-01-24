from PIL import Image, ImageOps, ImageEnhance
import math
from math import floor, ceil
import random

import numpy as np

class Skew(object):
    """
    This class is used to perform perspective skewing on images. It allows
    for skewing from a total of 12 different perspectives.
    """
    def __init__(self, probability, skew_type='TILT', magnitude=2):
        """
        As well as the required :attr:`probability` parameter, the type of
        skew that is performed is controlled using a :attr:`skew_type` and a
        :attr:`magnitude` parameter. The :attr:`skew_type` controls the
        direction of the skew, while :attr:`magnitude` controls the degree
        to which the skew is performed.

        To see examples of the various skews, see :ref:`perspectiveskewing`.

        Images are skewed **in place** and an image of the same size is
        returned by this function. That is to say, that after a skew
        has been performed, the largest possible area of the same aspect ratio
        of the original image is cropped from the skewed image, and this is
        then resized to match the original image size. The
        :ref:`perspectiveskewing` section describes this in detail.

        :param probability: Controls the probability that the operation is
         performed when it is invoked in the pipeline.
        :param skew_type: Must be one of ``TILT``, ``TILT_TOP_BOTTOM``,
         ``TILT_LEFT_RIGHT``, or ``CORNER``.

         - ``TILT`` will randomly skew either left, right, up, or down.
           Left or right means it skews on the x-axis while up and down
           means that it skews on the y-axis.
         - ``TILT_TOP_BOTTOM`` will randomly skew up or down, or in other
           words skew along the y-axis.
         - ``TILT_LEFT_RIGHT`` will randomly skew left or right, or in other
           words skew along the x-axis.
         - ``CORNER`` will randomly skew one **corner** of the image either
           along the x-axis or y-axis. This means in one of 8 different
           directions, randomly.

         To see examples of the various skews, see :ref:`perspectiveskewing`.

        :param magnitude: The degree to which the image is skewed.
        :type probability: Float
        :type skew_type: String
        :type magnitude: Integer
        """
        self.probability = probability
        self.skew_type = skew_type
        self.magnitude = magnitude

    def __call__(self, sample):
        """
        Perform the skew on the passed image(s) and returns the transformed
        image(s). Uses the :attr:`skew_type` and :attr:`magnitude` parameters
        to control the type of skew to perform as well as the degree to which
        it is performed.

        If a list of images is passed, they must have identical dimensions.
        This is checked when we add the ground truth directory using
        :func:`Pipeline.:func:`~Augmentor.Pipeline.Pipeline.ground_truth`
        function.

        However, if this check fails, the skew function will be skipped and
        a warning thrown, in order to avoid an exception.

        :param images: The image(s) to skew.
        :type images: List containing PIL.Image object(s).
        :return: The transformed image(s) as a list of object(s) of type
         PIL.Image.
        """

        # Width and height taken from first image in list.
        # This requires that all ground truth images in the list
        # have identical dimensions!
        image = sample
        w, h = image.size

        x1 = 0
        x2 = h
        y1 = 0
        y2 = w

        original_plane = [(y1, x1), (y2, x1), (y2, x2), (y1, x2)]

        max_skew_amount = max(w, h)
        max_skew_amount = int(ceil(max_skew_amount * self.magnitude))
        skew_amount = random.randint(1, max_skew_amount)

        # Old implementation, remove.
        # if not self.magnitude:
        #    skew_amount = random.randint(1, max_skew_amount)
        # elif self.magnitude:
        #    max_skew_amount /= self.magnitude
        #    skew_amount = max_skew_amount

        if self.skew_type == "RANDOM":
            skew = random.choice(["TILT", "TILT_LEFT_RIGHT", "TILT_TOP_BOTTOM", "CORNER"])
        else:
            skew = self.skew_type

        # We have two choices now: we tilt in one of four directions
        # or we skew a corner.

        if skew == "TILT" or skew == "TILT_LEFT_RIGHT" or skew == "TILT_TOP_BOTTOM":

            if skew == "TILT":
                skew_direction = random.randint(0, 3)
            elif skew == "TILT_LEFT_RIGHT":
                skew_direction = random.randint(0, 1)
            elif skew == "TILT_TOP_BOTTOM":
                skew_direction = random.randint(2, 3)

            if skew_direction == 0:
                # Left Tilt
                new_plane = [(y1, x1 - skew_amount),  # Top Left
                             (y2, x1),                # Top Right
                             (y2, x2),                # Bottom Right
                             (y1, x2 + skew_amount)]  # Bottom Left
            elif skew_direction == 1:
                # Right Tilt
                new_plane = [(y1, x1),                # Top Left
                             (y2, x1 - skew_amount),  # Top Right
                             (y2, x2 + skew_amount),  # Bottom Right
                             (y1, x2)]                # Bottom Left
            elif skew_direction == 2:
                # Forward Tilt
                new_plane = [(y1 - skew_amount, x1),  # Top Left
                             (y2 + skew_amount, x1),  # Top Right
                             (y2, x2),                # Bottom Right
                             (y1, x2)]                # Bottom Left
            elif skew_direction == 3:
                # Backward Tilt
                new_plane = [(y1, x1),                # Top Left
                             (y2, x1),                # Top Right
                             (y2 + skew_amount, x2),  # Bottom Right
                             (y1 - skew_amount, x2)]  # Bottom Left

        if skew == "CORNER":

            skew_direction = random.randint(0, 7)

            if skew_direction == 0:
                # Skew possibility 0
                new_plane = [(y1 - skew_amount, x1), (y2, x1), (y2, x2), (y1, x2)]
            elif skew_direction == 1:
                # Skew possibility 1
                new_plane = [(y1, x1 - skew_amount), (y2, x1), (y2, x2), (y1, x2)]
            elif skew_direction == 2:
                # Skew possibility 2
                new_plane = [(y1, x1), (y2 + skew_amount, x1), (y2, x2), (y1, x2)]
            elif skew_direction == 3:
                # Skew possibility 3
                new_plane = [(y1, x1), (y2, x1 - skew_amount), (y2, x2), (y1, x2)]
            elif skew_direction == 4:
                # Skew possibility 4
                new_plane = [(y1, x1), (y2, x1), (y2 + skew_amount, x2), (y1, x2)]
            elif skew_direction == 5:
                # Skew possibility 5
                new_plane = [(y1, x1), (y2, x1), (y2, x2 + skew_amount), (y1, x2)]
            elif skew_direction == 6:
                # Skew possibility 6
                new_plane = [(y1, x1), (y2, x1), (y2, x2), (y1 - skew_amount, x2)]
            elif skew_direction == 7:
                # Skew possibility 7
                new_plane = [(y1, x1), (y2, x1), (y2, x2), (y1, x2 + skew_amount)]

        if self.skew_type == "ALL":
            # Not currently in use, as it makes little sense to skew by the same amount
            # in every direction if we have set magnitude manually.
            # It may make sense to keep this, if we ensure the skew_amount below is randomised
            # and cannot be manually set by the user.
            corners = dict()
            corners["top_left"] = (y1 - random.randint(1, skew_amount), x1 - random.randint(1, skew_amount))
            corners["top_right"] = (y2 + random.randint(1, skew_amount), x1 - random.randint(1, skew_amount))
            corners["bottom_right"] = (y2 + random.randint(1, skew_amount), x2 + random.randint(1, skew_amount))
            corners["bottom_left"] = (y1 - random.randint(1, skew_amount), x2 + random.randint(1, skew_amount))

            new_plane = [corners["top_left"], corners["top_right"], corners["bottom_right"], corners["bottom_left"]]

        # To calculate the coefficients required by PIL for the perspective skew,
        # see the following Stack Overflow discussion: https://goo.gl/sSgJdj
        matrix = []

        for p1, p2 in zip(new_plane, original_plane):
            matrix.append([p1[0], p1[1], 1, 0, 0, 0, -p2[0] * p1[0], -p2[0] * p1[1]])
            matrix.append([0, 0, 0, p1[0], p1[1], 1, -p2[1] * p1[0], -p2[1] * p1[1]])

        A = np.matrix(matrix, dtype=np.float)
        B = np.array(original_plane).reshape(8)

        perspective_skew_coefficients_matrix = np.dot(np.linalg.pinv(A), B)
        perspective_skew_coefficients_matrix = np.array(perspective_skew_coefficients_matrix).reshape(8)

        image.transform(image.size,
                       Image.PERSPECTIVE,
                       perspective_skew_coefficients_matrix,
                       resample=Image.BICUBIC)
        return image