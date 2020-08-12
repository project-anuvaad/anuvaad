from pytesseract import pytesseract
from PIL import Image


def extract_text_from_image(filepath, desired_width, desired_height, df, lang='hin'):
    image = Image.open(filepath)
    image = image.resize((desired_width, desired_height))

    for index, row in df.iterrows():
        left = row['text_left']
        top = row['text_top']
        right = row['text_left'] + row['text_width']
        bottom = row['text_top'] + row['text_height']

        crop_image = image.crop((left, top, right, bottom))
        df.at[index, 'text'] = pytesseract.image_to_string(crop_image, lang=lang)

    return df
