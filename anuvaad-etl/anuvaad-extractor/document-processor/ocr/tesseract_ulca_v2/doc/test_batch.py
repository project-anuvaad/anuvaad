import requests
import json
import os
import time,glob,uuid


input_dir = "/home/srihari/anuvaad-toolkit/block_merger_latest/anuvaad/anuvaad-etl/anuvaad-extractor/document-processor/ocr/tesseract_ulca_v2/doc/bounding_box/hindi/*.jpg"
save_path = "report/"
lang = "hi"

service_url = "http://0.0.0.0:5000/anuvaad/ocr/v0/ulca-ocr"


def get_requeset(input_dir):
    req = {
    "config": {
        "language": {
            "sourceLanguage": lang
        }
        
    },
    "image":[]
}
    images = glob.glob(input_dir)

    for image in images:
        # image_name = image.split("/")[-1]
        print(image)
        req["image"].append({"local_path": image})
    return req


if __name__ == "__main__":
    print("ulca ocr service started")
    start_time = time.time()

    req = get_requeset(input_dir)
    print(req)
    res = requests.post(service_url, json=req, timeout=None)
    data = res.json()
    file_id = save_path+str(uuid.uuid4())+".json"
    with open(file_id, "w") as outfile:
        json.dump(data,outfile,ensure_ascii=True)
    
