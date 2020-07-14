# HTML2JSON

HTML2JSON service Converts a html file into a required json format as per our need.

## Prerequisites

I am using ubuntu 16.04 and python 3.7.7.
For HTML2JSON conversion, I have used this html2json opensource tool.

```url
https://github.com/garyhurtz/html2json.py.git
```
You need to install some libraries. I have specified the names and versions of python libraries in requirements.txt
```bash
pip install -r requirements.txt
```
## Usage
After successful installation of prerequisites, you will have to run app.py

```bash
python app.py
```
For every html file, user will receive json format of each tag that contains text. For example, this is json of single 'p' tag containing text:
```json
{
    "class": "ft00",
    "class_style": {
        "color": "#000009",
        "font-family": "BAAAAA+DejaVuSans",
        "font-size": "18px"
    },
    "is_bold": true,
    "page_height": "1263",
    "page_no": "1",
    "page_width": "892",
    "style": "position:absolute;top:108px;left:688px;white-space:nowrap",
    "text": "--------",
    "x": "688",
    "y": "108"
}
```


## License
[MIT](https://choosealicense.com/licenses/mit/)
