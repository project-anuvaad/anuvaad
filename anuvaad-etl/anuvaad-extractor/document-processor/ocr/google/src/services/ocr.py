import uuid, os, io
import config
from google.cloud import vision
client = vision.ImageAnnotatorClient()

def get_text(path,page_dict):
    with io.open(path, 'rb') as image_file:
        content = image_file.read()
    image = vision.types.Image(content=content)
    response = client.document_text_detection(image=image)
    page_output = get_document_bounds(response.full_text_annotation,page_dict)
    return page_output

def text_extraction(image_paths):
    page_res = []
    for image_path in image_paths:
        page_dict = {"identifier": str(uuid.uuid4()),"resolution": config.EXRACTION_RESOLUTION }
        page_output = get_text(image_path,page_dict)
        page_res.append(page_output)
    return page_res

def get_document_bounds(response,page_dict):
    page_dict["regions"] = []
    page_dict["lines"]   = []
    page_dict["words"]   = []
    
    
    for i,page in enumerate(response.pages):
        page_dict["vertices"]=  [{"x":0,"y":0},{"x":page.width,"y":0},{"x":page.width,"y":page.height},{"x":0,"y":page.height}]
        for block in page.blocks:
            block_region = {"identifier": str(uuid.uuid4()), "boundingBox":{"vertices":[]}, "class":'PARA',}
            block_vertices = []
            block_vertices.append({"x": block.bounding_box.vertices[0].x, "y": block.bounding_box.vertices[0].y})
            block_vertices.append({"x": block.bounding_box.vertices[1].x, "y": block.bounding_box.vertices[1].y})
            block_vertices.append({"x": block.bounding_box.vertices[2].x, "y": block.bounding_box.vertices[2].y})
            block_vertices.append({"x": block.bounding_box.vertices[3].x, "y": block.bounding_box.vertices[3].y})
            block_region["boundingBox"]["vertices"] = block_vertices
            page_dict["regions"].append(block_region)

            for paragraph in block.paragraphs:
                for word in paragraph.words:
                    word_region = {"identifier": str(uuid.uuid4()), "boundingBox":{"vertices":[]}}
                    word_vertices = []
                    word_vertices.append({"x": word.bounding_box.vertices[0].x, "y": word.bounding_box.vertices[0].y})
                    word_vertices.append({"x": word.bounding_box.vertices[1].x, "y": word.bounding_box.vertices[1].y})
                    word_vertices.append({"x": word.bounding_box.vertices[2].x, "y": word.bounding_box.vertices[2].y})
                    word_vertices.append({"x": word.bounding_box.vertices[3].x, "y": word.bounding_box.vertices[3].y})
                    word_region["boundingBox"]["vertices"] = word_vertices
                    page_dict["words"].append(word_region)
                    word_text = ''.join([
                        symbol.text for symbol in word.symbols
                    ])
                    word_region["text"] = word_text
                    word_region["confidence"] = word.confidence
                    if len(word.symbols[0].property.detected_languages)!=0:
                        word_region["language"] = word.symbols[0].property.detected_languages[0].language_code
                    else:
                        word_region["language"] = page.property.detected_languages[0].language_code
    return page_dict
