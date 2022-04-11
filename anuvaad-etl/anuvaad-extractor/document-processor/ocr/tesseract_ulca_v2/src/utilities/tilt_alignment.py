import cv2
import config
import imutils
import pandas as pd
import numpy as np
import os
import time
import datetime
import functools
import collections
import glob
import tensorflow as tf
from src.utilities.east import model
from src.utilities.east import lanms

class Orientation:

    def __init__(self, image,file_properties ,conf_threshold=50, lang='eng'):

        #self.image_path     = image_path
        self.image          = image
        self.file_properties = file_properties
        # self.lines          = lines
        self.conf_threshold = int(conf_threshold)

        self.timer = {'net': 0, 'restore': 0, 'nms': 0}
        self.text = {}
        self.lang = lang

        #self.re_orient()


    # def rotate_bound(self,image, angle):
    #     # grab the dimensions of the image and then determine the
    #     # center
    #     (h, w) = image.shape[:2]
    #     (cX, cY) = (w / 2, h / 2)

    #     # grab the rotation matrix (applying the negative of the
    #     # angle to rotate clockwise), then grab the sine and cosine
    #     # (i.e., the rotation components of the matrix)
    #     M = cv2.getRotationMatrix2D((cX, cY), -angle, 1.0)
    #     cos = np.abs(M[0, 0])
    #     sin = np.abs(M[0, 1])

    #     # compute the new bounding dimensions of the image
    #     nW = int((h * sin) + (w * cos))
    #     nH = int((h * cos) + (w * sin))

    #     # adjust the rotation matrix to take into account translation
    #     M[0, 2] += (nW / 2) - cX
    #     M[1, 2] += (nH / 2) - cY

    #     # perform the actual rotation and return the image
    #     return cv2.warpAffine(image, M, (nW, nH),flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)




    # def east_detect(self,image,args): 

    #     #orig = image.copy()
    #     #print(image)
    #     (H, W) = image.shape[:2]

    #     (newW, newH) = (args["width"], args["height"])
    #     rW = W / float(newW)
    #     rH = H / float(newH)

    #     image = cv2.resize(image, (newW, newH))
    #     (H, W) = image.shape[:2]

    #     layerNames = [
    #         "feature_fusion/Conv_7/Sigmoid",
    #         "feature_fusion/concat_3"]

    #     #print("[INFO] loading EAST text detector...")
    #     net = cv2.dnn.readNet(args["east"])

    #     blob = cv2.dnn.blobFromImage(image, 1.0, (W, H),
    #         (123.68, 116.78, 103.94), swapRB=True, crop=False)
    #     #start = time.time()
    #     net.setInput(blob)
    #     (scores, geometry) = net.forward(layerNames)
    #     #end = time.time()

    #     #print("[INFO] text detection took {:.6f} seconds".format(end - start))
    
    #     # confidence scores
    #     (numRows, numCols) = scores.shape[2:4]
    #     angl = []

    #     for y in range(0, numRows):
            
    #         scoresData = scores[0, 0, y]
    #         anglesData = geometry[0, 4, y]

    #         for x in range(0, numCols):
    #             if scoresData[x] < args["min_confidence"]:
    #                 continue
                
    #             angle = anglesData[x]
    #             angl.append(angle*180/(np.pi))

    #     return np.median(angl)


    # def east(self,image,args):

    #     angle = Orientation.east_detect(self,image,args)
    #     #print("angle*********",angle)

    #     return image,angle


    # def hough_transforms(self,image):
        
    #     gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    #     thresh = cv2.GaussianBlur(gray,(11,11),0)
    #     edges = canny(thresh)
    #     tested_angles = np.deg2rad(np.arange(0.1, 180.0))
    #     h, theta, d = hough_line(edges, theta=tested_angles)
    #     accum, angles, dists = hough_line_peaks(h, theta, d)

    #     return accum, angles, dists


    # def east_hough_line(self,image,args):
    #     image,angle = Orientation.east(self,image,args)
    #     h, theta, d = Orientation.hough_transforms(self,image)
    #     theta = np.rad2deg(np.pi/2-theta)
    #     #theta = np.rad2deg(theta-np.pi/2)
    #     margin = args['margin_tollerance']
    #     low_thresh = angle-margin
    #     high_thresh = angle+margin
    #     filter_theta = theta[theta>low_thresh]
    #     filter_theta = filter_theta[filter_theta < high_thresh]
        
    #     return image,np.median(filter_theta)


    # def re_orient_east(self):
    #     args = {
    #         "image": self.image,
    #         "east": config.EAST_MODEL,
    #         "min_confidence": config.MIN_CONFIDENCE,
    #         "margin_tollerance":config.MARGIN_TOLLERANCE,
    #         "width": config.EAST_WIDTH,
    #         "height": config.EAST_HEIGHT
    #     }

    #     image,angle = Orientation.east_hough_line(self,args['image'],args)
    #     print("Angle detectd is  {} ".format(angle))
    #     if abs(angle) > config.ANGLE_TOLLERANCE:
    #         print("Tilt correction started: ")
    #         image = Orientation.rotate_bound(self,image, angle)
    #         print("Tilt correction successfully completed: ")
        

    #     return image,angle



    def resize_image(self,im, max_side_len=2400):
        '''
        resize image to a size multiple of 32 which is required by the network
        :param im: the resized image
        :param max_side_len: limit of max image size to avoid out of memory in gpu
        :return: the resized image and the resize ratio
        '''
        h, w, _ = im.shape

        resize_w = w
        resize_h = h

        # limit the max side
        if max(resize_h, resize_w) > max_side_len:
            ratio = float(max_side_len) / resize_h if resize_h > resize_w else float(max_side_len) / resize_w
        else:
            ratio = 1.
        resize_h = int(resize_h * ratio)
        resize_w = int(resize_w * ratio)

        resize_h = resize_h if resize_h % 32 == 0 else (resize_h // 32 - 1) * 32
        resize_w = resize_w if resize_w % 32 == 0 else (resize_w // 32 - 1) * 32
        resize_h = max(32, resize_h)
        resize_w = max(32, resize_w)
        im = cv2.resize(im, (int(resize_w), int(resize_h)))

        ratio_h = resize_h / float(h)
        ratio_w = resize_w / float(w)

        return im, (ratio_h, ratio_w)


    def detect(self,score_map, geo_map, timer, score_map_thresh=0.8, box_thresh=0.1, nms_thres=0.2):
        '''
        restore text boxes from score map and geo map
        :param score_map:
        :param geo_map:
        :param timer:
        :param score_map_thresh: threshhold for score map
        :param box_thresh: threshhold for boxes
        :param nms_thres: threshold for nms
        :return:
        '''
        if len(score_map.shape) == 4:
            score_map = score_map[0, :, :, 0]
            geo_map = geo_map[0, :, :, ]
        # filter the score map
        xy_text = np.argwhere(score_map > score_map_thresh)
        # sort the text boxes via the y axis
        xy_text = xy_text[np.argsort(xy_text[:, 0])]
        # restore
        start = time.time()
        text_box_restored = Orientation.restore_rectangle(self,xy_text[:, ::-1]*4, geo_map[xy_text[:, 0], xy_text[:, 1], :]) # N*4*2
        # print('{} text boxes before nms'.format(text_box_restored.shape[0]))
        boxes = np.zeros((text_box_restored.shape[0], 9), dtype=np.float32)
        boxes[:, :8] = text_box_restored.reshape((-1, 8))
        boxes[:, 8] = score_map[xy_text[:, 0], xy_text[:, 1]]
        timer['restore'] = time.time() - start
        # nms part
        start = time.time()
        # boxes = nms_locality.nms_locality(boxes.astype(np.float64), nms_thres)
        boxes = lanms.merge_quadrangle_n9(boxes.astype('float32'), nms_thres)
        timer['nms'] = time.time() - start

        if boxes.shape[0] == 0:
            return None, timer

        # here we filter some low score boxes by the average score map, this is different from the orginal paper
        for i, box in enumerate(boxes):
            mask = np.zeros_like(score_map, dtype=np.uint8)
            cv2.fillPoly(mask, box[:8].reshape((-1, 4, 2)).astype(np.int32) // 4, 1)
            boxes[i, 8] = cv2.mean(score_map, mask)[0]
        boxes = boxes[boxes[:, 8] > box_thresh]

        return boxes, timer


    def sort_poly(self,p):
        min_axis = np.argmin(np.sum(p, axis=1))
        p = p[[min_axis, (min_axis+1)%4, (min_axis+2)%4, (min_axis+3)%4]]
        if abs(p[0, 0] - p[1, 0]) > abs(p[0, 1] - p[1, 1]):
            return p
        else:
            return p[[0, 3, 2, 1]]

    def restore_rectangle_rbox(self,origin, geometry):
        d = geometry[:, :4]
        angle = geometry[:, 4]
        # for angle > 0
        origin_0 = origin[angle >= 0]
        d_0 = d[angle >= 0]
        angle_0 = angle[angle >= 0]
        if origin_0.shape[0] > 0:
            p = np.array([np.zeros(d_0.shape[0]), -d_0[:, 0] - d_0[:, 2],
                        d_0[:, 1] + d_0[:, 3], -d_0[:, 0] - d_0[:, 2],
                        d_0[:, 1] + d_0[:, 3], np.zeros(d_0.shape[0]),
                        np.zeros(d_0.shape[0]), np.zeros(d_0.shape[0]),
                        d_0[:, 3], -d_0[:, 2]])
            p = p.transpose((1, 0)).reshape((-1, 5, 2))  # N*5*2

            rotate_matrix_x = np.array([np.cos(angle_0), np.sin(angle_0)]).transpose((1, 0))
            rotate_matrix_x = np.repeat(rotate_matrix_x, 5, axis=1).reshape(-1, 2, 5).transpose((0, 2, 1))  # N*5*2

            rotate_matrix_y = np.array([-np.sin(angle_0), np.cos(angle_0)]).transpose((1, 0))
            rotate_matrix_y = np.repeat(rotate_matrix_y, 5, axis=1).reshape(-1, 2, 5).transpose((0, 2, 1))

            p_rotate_x = np.sum(rotate_matrix_x * p, axis=2)[:, :, np.newaxis]  # N*5*1
            p_rotate_y = np.sum(rotate_matrix_y * p, axis=2)[:, :, np.newaxis]  # N*5*1

            p_rotate = np.concatenate([p_rotate_x, p_rotate_y], axis=2)  # N*5*2

            p3_in_origin = origin_0 - p_rotate[:, 4, :]
            new_p0 = p_rotate[:, 0, :] + p3_in_origin  # N*2
            new_p1 = p_rotate[:, 1, :] + p3_in_origin
            new_p2 = p_rotate[:, 2, :] + p3_in_origin
            new_p3 = p_rotate[:, 3, :] + p3_in_origin

            new_p_0 = np.concatenate([new_p0[:, np.newaxis, :], new_p1[:, np.newaxis, :],
                                    new_p2[:, np.newaxis, :], new_p3[:, np.newaxis, :]], axis=1)  # N*4*2
        else:
            new_p_0 = np.zeros((0, 4, 2))
        # for angle < 0
        origin_1 = origin[angle < 0]
        d_1 = d[angle < 0]
        angle_1 = angle[angle < 0]
        if origin_1.shape[0] > 0:
            p = np.array([-d_1[:, 1] - d_1[:, 3], -d_1[:, 0] - d_1[:, 2],
                        np.zeros(d_1.shape[0]), -d_1[:, 0] - d_1[:, 2],
                        np.zeros(d_1.shape[0]), np.zeros(d_1.shape[0]),
                        -d_1[:, 1] - d_1[:, 3], np.zeros(d_1.shape[0]),
                        -d_1[:, 1], -d_1[:, 2]])
            p = p.transpose((1, 0)).reshape((-1, 5, 2))  # N*5*2

            rotate_matrix_x = np.array([np.cos(-angle_1), -np.sin(-angle_1)]).transpose((1, 0))
            rotate_matrix_x = np.repeat(rotate_matrix_x, 5, axis=1).reshape(-1, 2, 5).transpose((0, 2, 1))  # N*5*2

            rotate_matrix_y = np.array([np.sin(-angle_1), np.cos(-angle_1)]).transpose((1, 0))
            rotate_matrix_y = np.repeat(rotate_matrix_y, 5, axis=1).reshape(-1, 2, 5).transpose((0, 2, 1))

            p_rotate_x = np.sum(rotate_matrix_x * p, axis=2)[:, :, np.newaxis]  # N*5*1
            p_rotate_y = np.sum(rotate_matrix_y * p, axis=2)[:, :, np.newaxis]  # N*5*1

            p_rotate = np.concatenate([p_rotate_x, p_rotate_y], axis=2)  # N*5*2

            p3_in_origin = origin_1 - p_rotate[:, 4, :]
            new_p0 = p_rotate[:, 0, :] + p3_in_origin  # N*2
            new_p1 = p_rotate[:, 1, :] + p3_in_origin
            new_p2 = p_rotate[:, 2, :] + p3_in_origin
            new_p3 = p_rotate[:, 3, :] + p3_in_origin

            new_p_1 = np.concatenate([new_p0[:, np.newaxis, :], new_p1[:, np.newaxis, :],
                                    new_p2[:, np.newaxis, :], new_p3[:, np.newaxis, :]], axis=1)  # N*4*2
        else:
            new_p_1 = np.zeros((0, 4, 2))
        return np.concatenate([new_p_0, new_p_1])


    def restore_rectangle(self,origin, geometry):
        return Orientation.restore_rectangle_rbox(self, origin, geometry)

    @functools.lru_cache(maxsize=100)
    def get_predictor(self,checkpoint_path):
        # logger.info('loading model')

        input_images = tf.placeholder(tf.float32, shape=[None, None, None, 3], name='input_images')
        global_step = tf.get_variable('global_step', [], initializer=tf.constant_initializer(0), trainable=False)

        f_score, f_geometry = model.model(input_images, is_training=False)

        variable_averages = tf.train.ExponentialMovingAverage(0.997, global_step)
        saver = tf.train.Saver(variable_averages.variables_to_restore())

        sess = tf.Session(config=tf.ConfigProto(allow_soft_placement=True))

        # ckpt_state = tf.train.get_checkpoint_state(checkpoint_path)
        model_path = config.EAST_CHECK_POINT_PATH
        # print(model_path)
        # logger.info('Restore from {}'.format(model_path))
        saver.restore(sess, model_path)

        def predictor(img):
            """
            :return: {
                'text_lines': [
                    {
                        'score': ,
                        'x0': ,
                        'y0': ,
                        'x1': ,
                        ...
                        'y3': ,
                    }
                ],
                'rtparams': {  # runtime parameters
                    'image_size': ,
                    'working_size': ,
                },
                'timing': {
                    'net': ,
                    'restore': ,
                    'nms': ,
                    'cpuinfo': ,
                    'meminfo': ,
                    'uptime': ,
                }
            }
            """
            start_time = time.time()
            rtparams = collections.OrderedDict()
            rtparams['start_time'] = datetime.datetime.now().isoformat()
            rtparams['image_size'] = '{}x{}'.format(img.shape[1], img.shape[0])
            timer = collections.OrderedDict([
                ('net', 0),
                ('restore', 0),
                ('nms', 0)
            ])

            im_resized, (ratio_h, ratio_w) = Orientation.resize_image(self,img)
            rtparams['working_size'] = '{}x{}'.format(
                im_resized.shape[1], im_resized.shape[0])
            start = time.time()
            score, geometry = sess.run(
                [f_score, f_geometry],
                feed_dict={input_images: [im_resized[:,:,::-1]]})
            timer['net'] = time.time() - start

            boxes, timer = Orientation.detect(self,score_map=score, geo_map=geometry, timer=timer)
            # logger.info('net {:.0f}ms, restore {:.0f}ms, nms {:.0f}ms'.format(
            #     timer['net']*1000, timer['restore']*1000, timer['nms']*1000))

            if boxes is not None:
                scores = boxes[:,8].reshape(-1)
                boxes = boxes[:, :8].reshape((-1, 4, 2))
                boxes[:, :, 0] /= ratio_w
                boxes[:, :, 1] /= ratio_h

            duration = time.time() - start_time
            timer['overall'] = duration
            # logger.info('[timing] {}'.format(duration))

            text_lines = []
            if boxes is not None:
                text_lines = []
                for box, score in zip(boxes, scores):
                    box = Orientation.sort_poly(self,box.astype(np.int32))
                    if np.linalg.norm(box[0] - box[1]) < 5 or np.linalg.norm(box[3]-box[0]) < 5:
                        continue
                    tl = collections.OrderedDict(zip(
                        ['x0', 'y0', 'x1', 'y1', 'x2', 'y2', 'x3', 'y3'],
                        map(float, box.flatten())))
                    tl['score'] = float(score)
                    # print(score,"scoreeee")
                    
                    text_lines.append(tl)
                    # print(text_lines,"text_linesssss")
            ret = {
                'text_lines': text_lines,
                'rtparams': rtparams,
                'timing': timer,
            }
            return ret


        return predictor

    def augment_df(self,rst):
        df = pd.DataFrame(rst['text_lines'], columns=['x0', 'y0', 'x1', 'y1', 'x2', 'y2', 'x3', 'y3'])
        df['height'] = df['y3'] - df['y0']
        df['width'] = df['x1'] - df['x0']
        df['ymid'] = (df['y3'] + df['y2']) * 0.5
        df['area'] = df['width'] * df['height']
        df = df.sort_values(by=['ymid'])
        df['group'] = None
        df['line_change'] = 0
        return df

    def get_rotaion_angle(self,text_cor_df):

        bbox_df = text_cor_df.copy()
        bbox_df = Orientation.augment_df(self,bbox_df)
        # print(bbox_df)
        bbox_df['delta_x'] = bbox_df['x2'] - bbox_df['x1']
        bbox_df['delta_y'] = bbox_df['y2'] - bbox_df['y1']
        box_dir = [bbox_df['delta_x'].mean(), bbox_df['delta_y'].mean()]
        # print(box_dir)
        x_axis = [1, 0]
        try:
            cosine = np.dot(box_dir, x_axis) / (np.linalg.norm(box_dir) * np.linalg.norm(x_axis))
        except Exception as e:
            print('ERROR in finding angle of rotaion!!!')
            print(e)
            cosine = 1
        angle = np.arccos(cosine) * 180 / np.pi
        angle = 90 - angle
        print("angleeeeeeee",angle * np.sign(box_dir[1]))
        return angle * np.sign(box_dir[1])
        
    def rotate_bound(self,image, angle):
        # grab the dimensions of the image and then determine the
        # center
        (h, w) = image.shape[:2]
        (cX, cY) = (w / 2, h / 2)

        # grab the rotation matrix (applying the negative of the
        # angle to rotate clockwise), then grab the sine and cosine
        # (i.e., the rotation components of the matrix)
        M = cv2.getRotationMatrix2D((cX, cY), -angle, 1.0)
        cos = np.abs(M[0, 0])
        sin = np.abs(M[0, 1])

        # compute the new bounding dimensions of the image
        nW = int((h * sin) + (w * cos))
        nH = int((h * cos) + (w * sin))

        # adjust the rotation matrix to take into account translation
        M[0, 2] += (nW / 2) - cX
        M[1, 2] += (nH / 2) - cY

        # perform the actual rotation and return the image
        return cv2.warpAffine(image, M, (nW, nH),flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)

    def hconcat_resize(self,img_list, 
                    interpolation 
                    = cv2.INTER_CUBIC):
        # take minimum hights
        h_min = min(img.shape[0] 
                    for img in img_list)
        
        # image resizing 
        im_list_resize = [cv2.resize(img,
                        (int(img.shape[1] * h_min / img.shape[0]),
                            h_min), interpolation
                                    = interpolation) 
                        for img in img_list]
        
        # return final image
        return cv2.hconcat(im_list_resize)

    def Draw_box(self,illu, rst):
        for t in rst['text_lines']:
            d = np.array([t['x0'], t['y0'], t['x1'], t['y1'], t['x2'],
                        t['y2'], t['x3'], t['y3']], dtype='int32')
            d = d.reshape(-1, 2)
            cv2.polylines(illu, [d], isClosed=True, color=(255, 255, 0),thickness = 3)
        return illu

    def re_orient_east(self):
        global predictor
        img = self.image
        rst = Orientation.get_predictor(self,config.EAST_CHECK_POINT_PATH)(img)
        angle = Orientation.get_rotaion_angle(self,rst)
        # cv2.imwrite(output_path, Orientation.Draw_box(img.copy(), rst))
        # save_dir = "/home/srihari/Desktop/tilt-correction-east/static/save_dir/"
        if abs(angle) > config.ANGLE_TOLLERANCE :
            img = Orientation.rotate_bound(self,img, angle)
            # vis = Orientation.hconcat_resize(self,[img.copy(), img])
            # cv2.imwrite(save_dir+"_angle_"+str(angle)+".jpg",vis)
            # print(angle,"angleeeeeeee1111")

        return img ,angle