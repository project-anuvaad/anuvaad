from src.repositories.pdf_operation import PdfOperation

pdf_ops = PdfOperation()

class ParagraphExtraction(object):
    def __init__(self):
        pass

    def para_extraction(self, input_pdf_file):
        output_path = pdf_ops.pdf_to_html(input_pdf_file)
        image_response = pdf_ops.html_to_imageprocess(output_path)
        html_response = pdf_ops.html_to_json(output_path)
        extracted_pdf_data = list()
        if len(image_response) == len(html_response):
            for i in range(len(image_response)):
                pagewise_response = {
                    "html_nodes" : html_response[i]['html_nodes'],
                    "image_data" : image_response[i]
                }
                extracted_pdf_data.append(pagewise_response)
        return extracted_pdf_data