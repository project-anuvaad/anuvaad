import numpy as np
import cv2


def get_words(response,page_index):
    page_data = response['outputs'][0]['pages'][page_index]
    words = []
    for para in page_data['regions'][1:]:
        for line in para['regions']:
            for word in line['regions']:
                words.append(word)
                
    return words
    

def get_border_color(image, box):
    points = box['boundingBox']['vertices']
    #try :
    border = np.concatenate([image[points[0]['y'] , points[0]['x'] : points[1]['x']],\
                            image[points[1]['y'] : points[2]['y'] , points[1]['x']],\
                             image[points[2]['y'] , points[3]['x'] : points[2]['x']],\
                             image[points[0]['y'] : points[3]['y'] , points[3]['x']]
                            ])
    #excpet
    return  np.median(border[:,0]),np.median(border[:,1]),np.median(border[:,2])

def inpaint_image(image,box,color,margin=2):
    #try:
    
    points = box['boundingBox']['vertices']
    image[points[0]['y'] - margin : points[3]['y'] + margin,points[0]['x'] -margin*2 : points[1]['x'] + margin*2,:] = color
    #except:
    return image

def heal_image(image_path,boxes,fill=None):
    image = cv2.imread(image_path)
    for box in boxes:
        if fill is None:
            border_color = get_border_color(image,box)
            image = inpaint_image(image,box,np.array(border_color))
        else:
            image = inpaint_image(image,box,np.array(fill))
    return image
