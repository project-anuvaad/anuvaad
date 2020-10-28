var jp              = require('jsonpath')

/**
 * function takes 'data' key of fetch_content api response as input 
 * @param {*} data 
 * @returns pages
 */
function get_pages_children_information(data) {
    let pages = []
    data.forEach(element => {
        let page = {
            'images': [],
            'texts': [],
            'lines': [],
            "page_height": element['page_height'],
            "page_no": element['page_no'],
            "page_width": element['page_width'],
        }

        if ('images' in element) {
            element['images'].forEach(image => {
                let block = {}
                block['block_identifier']    = image['block_identifier'];
                block['base64']              = image['base64'];
                block['text_top']            = image['text_top'];
                block['text_left']           = image['text_left'];
                block['text_width']          = image['text_width'];
                block['text_height']         = image['text_height'];
                page['images'].push(block);
            })
        }

        if ('lines' in element) {
            element['lines'].forEach(line => {
                let block = {}
                block['block_identifier']       = line['block_identifier'];
                page['text_top']                = line['text_top'];
                page['text_left']               = line['text_left'];
                page['text_width']              = line['text_width'];
                page['text_height']             = line['text_height'];
                page['lines'].push(block);
            })
        }

        if ('text_blocks' in element) {
            element['text_blocks'].forEach(text => {
                text.children.forEach(child => {
                    let block = {}
                    if (child.children == null) {
                        block['block_identifier']       = text['block_identifier'];
                        block['text']                   = child['text'];
                        block['text_top']               = child['text_top'];
                        block['text_left']              = child['text_left'];
                        block['text_width']             = child['text_width'];
                        block['text_height']            = child['text_height'];
                        block['attrib']                 = child['attrib'];
                        block['font_color']             = child['font_color'];
                        block['font_family']            = child['font_family'];
                        block['font_size']              = child['font_size'];
                        block['avg_line_height']        = child['avg_line_height'];
                        page['texts'].push(block);
                    } else {
                        child.children.forEach(child_elem => {
                            block['block_identifier']       = text['block_identifier'];
                            block['text']                   = child_elem['text'];
                            block['text_top']               = child_elem['text_top'];
                            block['text_left']              = child_elem['text_left'];
                            block['text_width']             = child_elem['text_width'];
                            block['text_height']            = child_elem['text_height'];
                            block['attrib']                 = child_elem['attrib'];
                            block['font_color']             = child_elem['font_color'];
                            block['font_family']            = child_elem['font_family'];
                            block['font_size']              = child_elem['font_size'];
                            block['avg_line_height']        = child_elem['avg_line_height'];
                            page['texts'].push(block);
                        })
                    }
                })
            })
        }

        if ('tokenized_sentences' in element) {
            let condition                       = `$..tokenized_sentences[*]`;
            let selected_tokenized_sentences    = jp.query(element, condition)
            page['translated_texts']            = JSON.parse(JSON.stringify(selected_tokenized_sentences))
        }
        pages.push(page)
    });

    return pages
}


module.exports = {
    get_pages_children_information,
}
