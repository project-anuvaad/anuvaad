import config
import cv2
import numpy as np
import uuid

def clean_image(image):

     def HSV_mask(img_hsv, lower):
          lower = np.array(lower)
          upper = np.array([255, 255, 255])
          return cv2.inRange(img_hsv, lower, upper)
     
     # img = cv2.imread("/home/srihari/Desktop/water_mark_issue/im/Gwalior_HC_page-0001.jpg")
     img = image

     img_hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

     img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)


     img_gray[img_gray >= 235] = 255

     mask1 = HSV_mask(img_hsv, [0, 0, 155])[..., None].astype(np.float32)

     mask2 = HSV_mask(img_hsv, [0, 20, 0])
     masked = np.uint8((img + mask1) / (1 + mask1 / 255))



     gray = cv2.cvtColor(masked, cv2.COLOR_BGR2GRAY)
     gray[gray >= 175] = 255


     gray[mask2 == 0] = img_gray[mask2 == 0]

     # clean = clean_image(gray)
     gray = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)
     # image_id=str(uuid.uuid4())
     # cv2.imwrite(f"/home/test/Tarento/anuvaad/anuvaad-etl/anuvaad-extractor/block-merger/upload/cleaned{image_id}.png", gray)

     return gray

# def clean_image(image):
#      image[config.WATERMARK_THRESHOLD_LOW < image ] = 255
#      return image

def background_image(image):
     image[config.WATERMARK_THRESHOLD_LOW > image ] = 255
     return image
