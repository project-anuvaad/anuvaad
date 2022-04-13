import config


def clean_image(image):
     image[config.WATERMARK_THRESHOLD_LOW < image ] = 255
     return image

def background_image(image):
     image[config.WATERMARK_THRESHOLD_LOW > image ] = 255
     return image