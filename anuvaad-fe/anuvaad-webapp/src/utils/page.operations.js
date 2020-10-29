var jp              = require('jsonpath')
const BLOCK_OPS     = require('./block.operations.js')

/**
 * @description sort sentence of a page by position
 * @param {*} sentences 
 * @returns sorted sentences
 */
function get_page_sorted_sentences(sentences) {
    let sorted_sentences      = sentences.sort((a, b) => {

        if (a.text_top < b.text_top) {
            return -1
        }
        if (a.text_top > b.text_top) {
            return 1
        }
        if (a.text_left > b.text_left) {
            return 1
        }
        if (a.text_left < b.text_left) {
            return -1
        }
        return 0
    })
    return sorted_sentences;
}

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
            'translated_texts': [],
            "page_height": element['page_height'],
            "page_no": element['page_no'],
            "page_width": element['page_width'],
        }

        if (element['images']) {
            element['images'].forEach(image => {
                page['images'].push(image);
            })
        }

        if (element['lines']) {
            element['lines'].forEach(line => {
                page['lines'].push(line);
            })
        }

        if (element['text_blocks']) {
            let sorted_text_blocks  = BLOCK_OPS.get_sorted_blocks(element['text_blocks'])

            sorted_text_blocks.forEach(text_block => {
                page['translated_texts'].push(...text_block['tokenized_sentences']);

                text_block.children.forEach(grandchildren => {
                    if (grandchildren['children']) {
                        grandchildren.children.forEach(child_elem => {
                            child_elem['block_identifier']  = text_block['block_identifier'];
                            child_elem['tag']               = 'GRAND_CHILDREN'
                            page['texts'].push(child_elem);
                        })
                    } else {
                        grandchildren['block_identifier']   = text_block['block_identifier'];
                        grandchildren['tag']                = 'CHILDREN'
                        page['texts'].push(grandchildren);
                    }
                })
            })
        }

        pages.push(page)
    });

    return pages
}

module.exports = {
    get_pages_children_information,
}
