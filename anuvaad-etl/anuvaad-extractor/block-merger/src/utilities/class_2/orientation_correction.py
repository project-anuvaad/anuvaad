class ExtractTextRegions:

    def __init__(self, image_path, session=sess, conf_threshold=50, lang='eng'):
        self.image_path = image_path
        self.image = cv2.imread(image_path)[:, :, ::-1]
        self.sess = session
        self.conf_threshold = int(conf_threshold)
        self.timer = {'net': 0, 'restore': 0, 'nms': 0}
        self.text = {}
        self.lang = lang
        self.extract_text_region()

    def east_output(self):
        out_put = []
        start = time.time()
        im_resized, (ratio_h, ratio_w) = postprocess.resize_image(self.image)
        score, geometry = self.sess.run([f_score, f_geometry], feed_dict={input_images: [im_resized]})
        self.timer['net'] = time.time() - start
        boxes, self.timer = postprocess.detect(score_map=score, geo_map=geometry, timer=self.timer)
        # #print (' net {:.0f}ms, restore {:.0f}ms, nms {:.0f}ms'.format (self.timer ['net'] * 1000,
        #                                                                self.timer ['restore'] * 1000,
        #                                                                self.timer ['nms'] * 1000))

        if boxes is not None:
            boxes = boxes[:, :8].reshape((-1, 4, 2))
            boxes[:, :, 0] /= ratio_w
            boxes[:, :, 1] /= ratio_h
        #
        if boxes is not None:
            for box in boxes:

                # to avoid submitting errors
                box = postprocess.sort_poly(box.astype(np.int32))
                # print(box)
                if np.linalg.norm(box[0] - box[1]) < 5 or np.linalg.norm(box[3] - box[0]) < 5:
                    continue
                out_put.append(
                    [box[0, 0], box[0, 1], box[1, 0], box[1, 1], box[2, 0], box[2, 1], box[3, 0], box[3, 1]])
        return out_put

    def convert_to_df(self):
        # dic = []
        # for i,box in enumerate(self.bbox):
        # dic.append({'x1': box[0] ,'y1': box[1] ,'x2': box[2] ,'y2': box[3] ,'x3': box[4] ,'y3': box[5] ,'x4': box[6] ,'y4': box[7]})
        df = pd.DataFrame(self.bbox, columns=['x1', 'y1', 'x2', 'y2', 'x3', 'y3', 'x4', 'y4'])
        df['height'] = df['y4'] - df['y1']
        df['width'] = df['x2'] - df['x1']
        df['ymid'] = (df['y4'] + df['y3']) * 0.5
        df['area'] = df['width'] * df['height']
        df = df.sort_values(by=['ymid'])
        df['group'] = None
        df['line_change'] = 0
        self.df = df

    def dump_out(self, bbc, rot):
        im = self.image.copy()
        for box in bbc:
            # print(box)
            cv2.polylines(im, [np.array(box).astype(np.int32).reshape((-1, 1, 2))], True, color=(255, 255, 0),
                          thickness=1)
        cv2.imwrite('tmp/' + str(rot) + '.png', im)

    def get_rotaion_angle(self, text_cor_df):

        bbox_df = text_cor_df.copy()
        # bboxex                = Box_cordinates (east_coordinates)
        bbox_df['delta_x'] = bbox_df['x2'] - bbox_df['x1']
        bboxex.df['delta_y'] = bboxex.df['y2'] - bboxex.df['y1']
        box_dir = [bboxex.df['delta_x'].mean(), bboxex.df['delta_y'].mean()]
        # print(box_dir)
        x_axis = [1, 0]
        cosine = np.dot(box_dir, x_axis) / (np.linalg.norm(box_dir) * np.linalg.norm(x_axis))
        angle = np.arccos(cosine) * 180 / np.pi
        avrage_height = bboxex.df['height'].mean()
        avrage_width = bboxex.df['width'].mean()
        if avrage_height > avrage_width:
            angle = 90 - angle

        return angle * np.sign(box_dir[1])

    def check_orientation(self, group_cordinates, margin=5):
        upside_down = False
        orientation = []
        for index, block in enumerate(group_cordinates):
            crop = self.image[block[0][1] - margin: block[1][1] + margin,
                   block[0][0] - margin: block[1][0] + margin]
            try:
                osd = pytesseract.image_to_osd(crop)
                angle = osd.split('\nRotate')[0].split(': ')[-1]
                orientation.append(int(angle))
            except:
                pass
        orientation = np.array(orientation)
        chk_orientation = orientation > 170

        # Taking vote of regions
        if chk_orientation.sum() > (len(orientation) * 0.5):
            # print ('Image is upside down')
            upside_down = True
            return upside_down

        return upside_down

    def extract_text_region(self):
        # try :
        east_cor = self.east_output()

        angle = self.get_rotaion_angle(east_cor)
        rotations = 1
        # self.dump_out(east_cor,rotations)
        # Orientation correction
        while abs(angle) > 2.5:
            self.image = imutils.rotate_bound(self.image, -angle)

            if rotations > 1:
                # Remove rotaion artifacts
                contours = cv2.findContours(cv2.cvtColor(self.image, cv2.COLOR_BGR2GRAY), cv2.RETR_EXTERNAL,
                                            cv2.CHAIN_APPROX_SIMPLE)
                contours = contours[0] if len(contours) == 2 else contours[1]
                if len(contours) > 0:
                    x, y, w, h = cv2.boundingRect(contours[0])
                    # print('cropped area reduced ')
                    self.image = self.image[y:y + h, x:x + w, :]

            east_cor = self.east_output()
            angle = self.get_rotaion_angle(east_cor)
            rotations += 1
            # self.dump_out(east_cor,rotations)
        bbox1 = Box_cordinates(east_cor)
        upside_down = self.check_orientation(bbox1.gr_cordinates)
        if upside_down:
            self.image = imutils.rotate_bound(self.image, 180)
            east_cor = self.east_output()
            # self.dump_out(east_cor,rotations)
        bbox2 = Box_cordinates(east_cor, image=self.image, conf_threshold=self.conf_threshold)
        text_dic, avrage_confidence = bbox2.get_text(lang=self.lang)
        # added text text_postprocessing
        self.text = {'metadata': Text_to_json(text_dic).metadata, 'text': [text_dic],
                     'avrage_confidence': avrage_confidence}

#         except :
#             logging.debug('Text extaction failed for {0}'.format(self.image_path))
