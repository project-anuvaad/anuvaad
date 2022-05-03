import os
import sys
import random
import torch
import glob
import torchvision
import sys
from skimage import io
import config

from torchvision.models.detection.faster_rcnn import FastRCNNPredictor
from torchvision.models.detection.mask_rcnn import MaskRCNNPredictor
from torchvision.transforms import transforms
from craft_pytorch.detect import detect_text
import cv2
import numpy as np

seed = 1234
random.seed(seed)
torch.manual_seed(seed)
torch.cuda.manual_seed_all(seed)
torch.backends.cudnn.deterministic = True
torch.backends.cudnn.benchmark = False


CATEGORIES2LABELS = {
    0: "bg",
    1: "text",
    2: "title",
    3: "list",
    4: "table",
    5: "figure"
}

def get_instance_segmentation_model(num_classes):
    model = torchvision.models.detection.maskrcnn_resnet50_fpn(pretrained=True)
    in_features = model.roi_heads.box_predictor.cls_score.in_features
    model.roi_heads.box_predictor = FastRCNNPredictor(in_features, num_classes)
    in_features_mask = model.roi_heads.mask_predictor.conv5_mask.in_channels
    hidden_layer = 256
    model.roi_heads.mask_predictor = MaskRCNNPredictor(in_features_mask,hidden_layer,num_classes)
    return model

def load_pubnet_model():
    num_classes = 6
    model = get_instance_segmentation_model(num_classes)
    checkpoint = torch.load(config.PUBNET_MODEL_PATH, map_location='cpu')
    model.load_state_dict(checkpoint['model'])
    model.eval()
    return model

model  = load_pubnet_model()

def pubnet(image_path):
    org_image = cv2.imread(image_path)
    rat = 1300 / org_image.shape[0]
    image = cv2.resize(org_image, None, fx=rat, fy=rat)
    transform = transforms.Compose([
        transforms.ToPILImage(),
        transforms.ToTensor()
    ])
    image = transform(image)

    with torch.no_grad():
        prediction = model([image])

    image = torch.squeeze(image, 0).permute(1, 2, 0).mul(255).numpy().astype(np.uint8)
    df_lis = []
    for pred in prediction:
        temp_dict  = {}
        for idx, mask in enumerate(pred['masks']):
            if pred['scores'][idx].item() < 0.50:
                continue
            m = mask[0].mul(255).byte().cpu().numpy()
            box = list(map(int, pred["boxes"][idx].tolist()))
            
            label = CATEGORIES2LABELS[pred["labels"][idx].item()]

            score = pred["scores"][idx].item()            
            df = detect_text(image_paths =org_image[int(box[1]/rat)-2:int(box[3]/rat)+2, int(box[0]/rat)-2:int(box[2]/rat)+2],img_class="double_col")
            temp_dict["attrib"] = str(label)
            temp_dict["df"]     = df[0]
            df_lis.append(temp_dict)
    return df_lis

