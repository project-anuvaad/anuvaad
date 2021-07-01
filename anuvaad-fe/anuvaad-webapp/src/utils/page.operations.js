var jp = require('jsonpath')
const BLOCK_OPS = require('./block.operations.js')

/**
 * @description sort sentence of a page by position
 * @param {*} sentences 
 * @returns sorted sentences
 */
function get_page_sorted_sentences(sentences) {
    let sorted_sentences = sentences.sort((a, b) => {

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
export const get_pages_children_information = (data, active_page, active_next_page) => {
    let pages = []
    data.forEach(element => {
        
        if(element.page_no === active_page || element.page_no === active_next_page){
        let page = {
            'images': [],
            'blocks': [],
            'lines': [],
            'translated_texts': [],
            "page_height": element['page_height'],
            "page_no": element['page_no'],
            "page_width": element['page_width'],
            
        }

        if (element['images']) {
            element['images'].forEach(image => {
                if(image.attrib === 'BGIMAGE')
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
                
                let blockValue={
                    'texts': [],
                    
                }

                page['translated_texts'].push(...text_block['tokenized_sentences'].map(v => ({...v, block_identifier: text_block.block_identifier})));
                blockValue['text_height']   = text_block['text_height'];
                blockValue['text_left']     = text_block.text_left;
                blockValue['text_top']      = text_block.text_top;
                blockValue['text_width']    = text_block.text_width;
                blockValue['childrenLength']= text_block.children.length;
                blockValue['block_identifier']  = text_block['block_identifier'];
                text_block.merged_block_id && (blockValue['merged_block_id'] = text_block.merged_block_id);
                text_block.children.forEach(grandchildren => {
                    if (grandchildren['children']) {
                             grandchildren.children.forEach(child_elem => {
                            child_elem['block_identifier']  = text_block['block_identifier'];
                            child_elem["parent_block_id"]   = text_block.block_id
                            child_elem["page_no"] = text_block && text_block.page_info && text_block.page_info.page_no
                            if (text_block['tokenized_sentences'].length > 0) {
                                child_elem['sentence_id']    = text_block['tokenized_sentences'][0].s_id;
                            }
                            blockValue["texts"].push(child_elem);
                        })
                    } else {
                        grandchildren["parent_block_id"]       = text_block.block_id
                        grandchildren['block_identifier']   = text_block['block_identifier'];
                        grandchildren["page_no"] = text_block && text_block.page_info && text_block.page_info.page_no;
                        if (text_block['tokenized_sentences'].length > 0) {
                            grandchildren['sentence_id']    = text_block['tokenized_sentences'][0].s_id;
                        }
                        blockValue["texts"].push(grandchildren);
                    }
                })
                page['blocks'].push(blockValue)
                
            })
        }

        pages.push(page)
    }
    });

    return pages
}

export const get_pages_tokenisation_information = (data) => {
    let pages = []
    data.forEach(element => {
        // console.log(element)
        let page = {
            'images': [],
            'blocks': [],
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
                
                let blockValue={
                    'texts': [],
                    
                }

                blockValue['text_height']   = text_block['text_height'];
                blockValue['text_left']     = text_block.text_left;
                blockValue['text_top']      = text_block.text_top;
                blockValue['text_width']    = text_block.text_width;
                blockValue['line_height']   = text_block.avg_line_height;
                blockValue['font_family']   = text_block.font_family;
                blockValue['font_color']   = text_block.font_color;
                blockValue['font_size']   = text_block.font_size;
                blockValue['attrib']   =    text_block.attrib;
                blockValue['childrenLength']= text_block.children.length;

                blockValue['block_identifier']  = text_block['block_identifier'];
                text_block.merged_block_id && (blockValue['merged_block_id'] = text_block.merged_block_id);

                text_block.tokenized_sentences.forEach(token_obj => {
                    token_obj['block_identifier']  = text_block['block_identifier']
                    token_obj["parent_block_id"]   = text_block.block_id
                    token_obj["page_no"] = text_block && text_block.page_info && text_block.page_info.page_no
                    blockValue["texts"].push(token_obj);
                })

                page['blocks'].push(blockValue)
                
            })
        }

        pages.push(page)
    });

    return pages
}

/**
 * @description updates the tokenized sentence array based upon s_id found
 * @param {*} data , pages of the document
 * @param {*} sentences 
 * @returns updated page data
 */
export const update_tokenized_sentences = (data, sentences) => {
    let copied_data = JSON.parse(JSON.stringify(data))

    copied_data.forEach(element => {
        if (element['text_blocks']) {
            element['text_blocks'].forEach(text_block => {
                text_block['tokenized_sentences'].forEach((tokenized_sentence, index) => {
                    sentences.forEach(sentence => {
                        if (tokenized_sentence.s_id === sentence.s_id) {
                            text_block['tokenized_sentences'].splice(index, 1, sentence)
                        }
                    })
                })
            });
        }
    });
    return copied_data;
}

/**
 * @description updates the block array based upon block_identifier found
 * @param {*} data , pages of the document
 * @param {*} sentences 
 * @returns updated page data
 */
export const update_blocks = (data, blocks) => {
    let copied_data = JSON.parse(JSON.stringify(data))
    copied_data.forEach(element => {
        if (element['text_blocks']) {
            element['text_blocks'].forEach((text_block, index) => {
                blocks.forEach(block => {
                    if (text_block.block_identifier === block.block_identifier) {
                        element['text_blocks'].splice(index, 1, block)
                    }
                })
            });
        }
    });
    return copied_data;
}


export const page_status = (data, active_page) => {
    let status = true;
    let copied_data = JSON.parse(JSON.stringify(data))
    copied_data.forEach(element => {
        if(element.page_no === active_page){
            status = false;
        }
    });
    
    return status;
}

export const get_updated_page_blocks = (data, blockData, updatedText, id) => {
    let blockIdentifier = blockData.block_identifier

    let condition = `$..[*].text_blocks[?(@.block_identifier == '${blockIdentifier}')]`;
    let textBlocks = jp.query(data, condition)
    let src = ""

    let textBlock = textBlocks && Array.isArray(textBlocks) && textBlocks.length > 0 && textBlocks[0]
    textBlock.children && Array.isArray(textBlock.children) && textBlock.children.length > 0 && textBlock.children.map(children => {

        if (children && children.hasOwnProperty("children") && Array.isArray(children.children) && children.children.length > 0) {
            children.children.map(grandchildren => {
                if (grandchildren.block_id && grandchildren.block_id === blockData.block_id) {
                    src = src + " " + updatedText
                    grandchildren.text = updatedText
                } else {
                    src = src + " " + grandchildren.text
                }
            })
        } else {
            if (children && children.block_id && children.block_id === blockData.block_id) {
                src = src + " " + updatedText
                children.text = updatedText
            } else {
                src = src + " " + children.text
            }
        }
        textBlock.text = src
    })
    return textBlock

}

export const get_sentence_count = (data, active_page) => {
    let result = get_pages_children_information(data, active_page);
    return result.length>0 && result[0].translated_texts.length;
}

export const get_total_sentence_count = (data , filename) =>{
    let progress = "";
    data.documents.map(files =>{
        if(files.converted_filename === filename){
            progress = files.progress; 
        }
    })
    return progress;
}

