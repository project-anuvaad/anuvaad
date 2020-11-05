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
function get_pages_children_information(data) {
    let pages = []
    data.forEach(element => {
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

                page['translated_texts'].push(...text_block['tokenized_sentences'].map(v => ({...v, block_identifier: text_block.block_identifier})));
                blockValue['text_height']   = text_block['text_height'];
                blockValue['text_left']     = text_block.text_left;
                
                blockValue['text_top']      = text_block.text_top;
                blockValue['text_width']    = text_block.text_width;
                blockValue['block_identifier']  = text_block['block_identifier'];
               
                text_block.children.forEach(grandchildren => {
                    if (grandchildren['children']) {
                             grandchildren.children.forEach(child_elem => {
                            child_elem['block_identifier']  = text_block['block_identifier'];
                            child_elem['tag']               = 'GRAND_CHILDREN';
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
                        grandchildren['tag']                = 'CHILDREN'
                        blockValue["texts"].push(grandchildren);
                    }
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
function update_tokenized_sentences(data, sentences) {
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
function update_blocks(data, blocks) {
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

function get_updated_page_blocks(data, blockData, updatedText, id) {
    let blockId = blockData.parent_block_id
    
    let updatedblock = {}
    if (data && data.pages && Array.isArray(data.pages) && data.pages.length > 0) {
        data.pages.map(pages => {
            if (pages.page_no === blockData.page_no) {
                if (pages && pages.text_blocks && Array.isArray(pages.text_blocks) && pages.text_blocks.length > 0) {
                    pages.text_blocks.map(block => {

                        let src = ""
                        if (blockId === block.block_id) {
                            
                            if (block && block.children && Array.isArray(block.children) && block.children.length > 0) {
                                block.children.map(children => {

                                    if (children && children.hasOwnProperty("children") && Array.isArray(children.children) && children.children && children.children.length > 0) {
                                      
                                        children.children.map(grandChildren => {

                                            if (grandChildren.block_id && grandChildren.block_id === blockData.block_id) {
                                                src = src + " " + updatedText
                                                grandChildren.text = updatedText
                                                updatedblock = block
                                            } else {
                                                src = src + " " + grandChildren.text
                                            }

                                        })
                                    } else {

                                        if (children && children.block_id && children.block_id === blockData.block_id) {
                                            src = src + " " + updatedText
                                            children.text = updatedText
                                            updatedblock = block

                                        } else {
                                            src = src + " " + children.text
                                        }
                                    }
                                   
                                    updatedblock.text = src
                                })
                            }
                        }

                    })
                }

            }
        })
        return updatedblock
    }

}


export default {
    get_pages_children_information,
    update_tokenized_sentences,
    update_blocks,
    get_updated_page_blocks
}