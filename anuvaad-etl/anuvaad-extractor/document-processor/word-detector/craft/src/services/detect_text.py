from src.utilities.tilt_alignment import Orientation
from src.utilities.craft_pytorch.detect import detect_text
import config
import torch
from src.utilities.request_parse import get_files, File


def get_coords(images,app_context,languages='hi'):

    files = get_files(app_context.application_context)
    if torch.cuda.is_available():
        torch.cuda.device(0)
        print("*******cuda available")
        torch.cuda.empty_cache()
        
    if config.ALIGN:
        words, lines = [] , []
        for file_index,file_imgs in enumerate(images):
            file_words, file_lines = [],[]
            for img in file_imgs:
                page_words,page_lines = Orientation(img,File(files[file_index])).re_orient()
                file_words.append(page_words)
                file_lines.append(page_lines)
            words.append(file_words)
            lines.append(file_lines)

    else:
        words, lines = detect_text(images, languages)
    return words,lines
