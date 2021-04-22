from src.utilities.tilt_alignment import Orientation
from src.utilities.craft_pytorch.detect import detect_text
import config
import torch


def get_coords(images,languages='hi'):
    if torch.cuda.is_available():
        torch.cuda.device(0)
        print("*******cuda available")
        torch.cuda.empty_cache()
        
    if config.ALIGN:
        words, lines = [] , []
        for file_imgs in images:
            file_words, file_lines = [],[]
            for img in file_imgs:
                page_words,page_lines = Orientation(img).re_orient()
                file_words.append(page_words)
                file_lines.append(page_lines)
            words.append(file_words)
            lines.append(file_lines)

    else:
        words, lines = detect_text(images, languages)
    return words,lines
