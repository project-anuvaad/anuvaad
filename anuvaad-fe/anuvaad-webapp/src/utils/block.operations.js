var jp                = require('jsonpath')
const { v4 }        = require('uuid');

function flattenArray(array) {
    return array.reduce(function(memo, el) {
      var items = Array.isArray(el) ? flattenArray(el) : [el];
      return memo.concat(items);
    }, []);
}

function get_block_id(blocks) {
    let block_ids = []
    blocks.forEach(element => {
        block_ids.push(element.split('_')[0])
    });
    return block_ids
}

/*
function get_page_id(blocks) {
    let page_ids = []
    blocks.forEach(element => {
        page_ids.push(parseInt(element.split('_')[1]))
    });
    return page_ids
}
*/

function get_blocks(sentences, block_ids) {
    let blocks  = []
    sentences   = JSON.parse(JSON.stringify(sentences))

    block_ids.forEach(element => {
        let condition           = `$..[*].text_blocks[?(@.block_id == '${element}')]`;
        let selected_blocks     = jp.query(sentences, condition)

        selected_blocks.forEach(element => {

            element.children.forEach(child => {
                child.page_no = element.page_info.page_no
            })
            blocks.push(element)
        })

    })
    return blocks
}

function get_all_text_blocks(sentences) {
    sentences       = JSON.parse(JSON.stringify(sentences))
    let condition   = '$..[*].text_blocks[*]'
    let blocks      = jp.query(sentences, condition)
    return blocks
}

function get_sentence_id_blocks(sentences, blocks, s_id) {
    let selected_blocks = []
    sentences       = JSON.parse(JSON.stringify(sentences))
    blocks          = JSON.parse(JSON.stringify(blocks))

    blocks.forEach(element => {
        let condition   = `$.tokenized_sentences[?(@.s_id == '${s_id}')]`;
        let selects     = jp.query(element, condition)
        if (selects.length === 1) {
            selected_blocks.push(element)
            return selected_blocks
        }
    })
    return selected_blocks
}

/**
 * @description sorts the block based upon the largest area and return the largest area block
 * @param {*} selected blocks
 */
function get_largest_area_block(blocks) {
    let descending_areas = blocks.sort((a, b) => {
        if ((a.text_width * a.text_height) > (b.text_width * b.text_height)) {
            return -1
        }
        if ((a.text_width * a.text_height) < (b.text_width * b.text_height)) {
            return 1
        }
        return 0
    })

    return descending_areas[0]
}

/**
 * @description sorts the children block based upon top, left & page number, concatenates the text present in the children
 * @param {*} blocks selected blocks
 */
function get_concatenated_text(blocks) {
    blocks          = JSON.parse(JSON.stringify(blocks))
    let condition   = '$[*].children[*]'
    let children    = jp.query(blocks, condition)

    let sorted_blocks      = children.sort((a, b) => {

        if (a.page_no > b.page_no) {
            return 1
        }
        if (a.page_no < b.page_no) {
            return -1
        }
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

    let texts       = []
    sorted_blocks.forEach(element => {
        texts.push(element.text)
    })

    return texts.join(' ')
}

/**
 *
 * @param {*} sentences, list of all the sentences in which merge operation has to be performed
 * @param {*} selected_block_ids, selected block_ids
 */
function get_merged_blocks(sentences, selected_block_ids) {
    let selected_blocks     = get_blocks(sentences, get_block_id(selected_block_ids))
    let largest_block       = get_largest_area_block(selected_blocks)
    let text                = get_concatenated_text(selected_blocks)

    let updated_blocks      = []

    selected_blocks.forEach(element => {
        if (element.block_identifier === largest_block.block_identifier) {
            element.text    = text

        } else {
            element.text                = null
            element.tokenized_sentences = []
        }
        element.block_id = largest_block.block_id
        element.has_sibling = true
        updated_blocks.push(element)
    })

    return updated_blocks;
}

/**
 * @description returns a block that actually has "tokenized_sentences" by checking length
 * @param {*} blocks, select list of blocks that have same block_id
 */
function get_tokenized_sentences_block(blocks) {
  return blocks.filter(element => (element.tokenized_sentences && element.tokenized_sentences.length > 0))[0]
}

/**
 * @description finds index of sentence_id
 * @param {*} tokenized_sentences, holds all the sentences
 * @param {*} sentence_id, sentence whose index needs to be determined
 *
 * @returns index of sentence_id
 */
function get_sentence_id_index(tokenized_sentences, sentence_id) {
  for (var i = 0; i < tokenized_sentences.length; i++) {
    if (tokenized_sentences[i].s_id === sentence_id) {
      return i;
    }
  }
}

/**
 * @description get unique blocks based upon block_identifier
 * @param {*} blocks 
 */
function get_unique_blocks(blocks) {
    let hashMap = new Map();

    let unique  = blocks.filter(el => {
        const val   = hashMap.get(el.block_identifier);
        
        if(val) {
            return false;
        }
        hashMap.set(el.block_identifier, el.block_identifier);
        return true;
    });
    return unique;
}

/**
 * @description sort block by page_no and position
 * @param {*} blocks 
 * @returns sorted blocks
 */
function get_sorted_blocks(blocks) {
    let sorted_blocks      = blocks.sort((a, b) => {
        if (a.page_info.page_no > b.page_info.page_no) {
            return 1
        }
        if (a.page_info.page_no < b.page_info.page_no) {
            return -1
        }
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
    return sorted_blocks;
}

/**
 * @description get tokenized_sentences of the blocks
 * @param {*} blocks 
 * @returns tokenized_sentences
function get_blocks_tokenized_sentences(blocks) {
    let condition           = '$..tokenized_sentences[*]'
    let tokenized_sentences = jp.query(blocks, condition)
    return tokenized_sentences
}
 */

/**
 * @description, get start and end index of sentence_ids spread across the blocks
 * @param {*} blocks 
 * @param {*} sentence_ids 
function get_start_end_index(blocks, sentence_ids) {
    let first_block         = blocks[0]
    let last_block          = blocks[blocks.length - 1]

    let first_block_indices = []
    for (let i = 0; i < first_block.tokenized_sentences.length; i++) {
        sentence_ids.forEach(s_id => {
            if (s_id === first_block.tokenized_sentences[i].s_id) {
                first_block_indices.push(i)
            }
        })
    }

    first_block_indices     = first_block_indices.sort((a, b) => a - b)

    let last_block_indices  = []
    for (let j = 0; j < last_block.tokenized_sentences.length; j++) {
        sentence_ids.forEach(s_id => {
            if (s_id === last_block.tokenized_sentences[j].s_id) {
                last_block_indices.push(j)
            }
        })
    }

    last_block_indices      = last_block_indices.sort((a, b) => b - a)

    return {
        'first': first_block_indices[0],
        'last' : last_block_indices[0]
    }
}
*/

/**
 * finds sentence_id index in the given sorted blocks
 * @param {*} blocks 
 * @param {*} sentence_ids 
 * @returns array of sentence_id and its index
 */
function get_sentence_ids_in_ascending_order(blocks, sentence_ids) {
    let sentence_ids_indices = []

    blocks.forEach(block => {
        let block_sentence_indices = []
        sentence_ids.forEach(s_id => {
            for (var i = 0; i < block.tokenized_sentences.length; i++) {
                if (s_id === block.tokenized_sentences[i].s_id) {
                    block_sentence_indices.push({'s_id': s_id, 
                    'index': i, 
                    'block_identifer': block.block_identifier, 
                    'src': block.tokenized_sentences[i].src })
                }
            }
            block_sentence_indices     = block_sentence_indices.sort((a, b) => {
                if (a.index < b.index) {
                    return -1
                }
                if (a.index > b.index) {
                    return 1
                }
                return 0
            })
        })
        sentence_ids_indices.push(block_sentence_indices)
    })
    return sentence_ids_indices
}

/**
 * @description merges the source sentences between sentence_id that is present at the lowest index of the
 *              tokenized sentence in asending order of indices.
 * @param {*} sentences, list of all the sentences in which merge operation has to be performed
 * @param {*} block_id, operation performed on specific block
 * @param {*} sentence_id_1, start selection index
 * @param {*} sentence_id_2,  end selection index
 *
 * @returns updated block
 */
function do_sentences_merging(sentences, block_id, sentence_id_1, sentence_id_2) {
    let selected_block_ids          = []
    selected_block_ids.push(block_id)

    let selected_blocks             = get_blocks(sentences, selected_block_ids)
    let tokenized_sentences_block   = get_tokenized_sentences_block(selected_blocks)
    let index1                      = get_sentence_id_index(tokenized_sentences_block.tokenized_sentences, sentence_id_1)
    let index2                      = get_sentence_id_index(tokenized_sentences_block.tokenized_sentences, sentence_id_2)
    let start                       = null
    let end                         = null

    if (index1 > index2) {
        start   = index2
        end     = index1
    } else {
        start   = index1
        end     = index2
    }
    /**
     * split tokenized sentences into three portion. Taking care of position
     */
    let first_sentences_obj_arr  = tokenized_sentences_block.tokenized_sentences.slice(0, start)
    let second_sentences_obj_arr = tokenized_sentences_block.tokenized_sentences.slice(start, end+1)
    let third_sentences_obj_arr  = tokenized_sentences_block.tokenized_sentences.slice(end+1)

    /**
     * copy each element from first portion into a local array
     */
    let final_tokenized_sentences = []
    first_sentences_obj_arr.forEach((e) => final_tokenized_sentences.push(e))

    /**
     * 1. merge the sentences first to create new sentence
     * 2. move the merged sentence to first object of sencond array, keep all information same
     * 3. push this object to local array
     */
    let merged_sentence = ""
    second_sentences_obj_arr.forEach((e) => {
        merged_sentence += e.src
    })
    second_sentences_obj_arr[0].src    = merged_sentence
    final_tokenized_sentences.push(second_sentences_obj_arr[0])

    /**
     * copy third part of array into the local array
     */
    third_sentences_obj_arr.forEach((e) => final_tokenized_sentences.push(e))

    /**
     * replace the local array into the tokenized sentence block
     */
    tokenized_sentences_block.tokenized_sentences = final_tokenized_sentences
    return tokenized_sentences_block
}

/**
 * @description merge the provided sentence_ids and create new sentences
 * @param {*} sentences 
 * @param {*} sentence_ids 
 */
function do_sentences_merging_v1(sentences, sentence_ids) {
    let text_blocks     = get_all_text_blocks(sentences)
    let selected_blocks = []

    sentence_ids.forEach(element => {
        let block = get_sentence_id_blocks(sentences, text_blocks, element)
        if (block.length === 1) {
            selected_blocks.push(block[0])
        }
    })

    let unique_selected_blocks      = get_unique_blocks(selected_blocks);
    let sorted_selected_blocks      = get_sorted_blocks(unique_selected_blocks);
    let sentence_indices            = get_sentence_ids_in_ascending_order(sorted_selected_blocks, sentence_ids)
    sentence_indices                = flattenArray(sentence_indices)

    let merged_sentence             = ""
    let tokenized_sentence          = sorted_selected_blocks[0].tokenized_sentences[sentence_indices[0].index]
    sorted_selected_blocks.forEach(block => {
        sentence_indices.forEach(sentence_index => {
            block.tokenized_sentences.forEach(sentence => {
                if (sentence.s_id === sentence_index.s_id) {
                    merged_sentence= merged_sentence.trim()
                    merged_sentence += " "+sentence.src
                    block.tokenized_sentences.splice(sentence_index.index, 1)
                    block.tokenized_sentences.splice(sentence_index.index, 0, {})
                }
            })
        })
    })

    sorted_selected_blocks.forEach(block => {
        let updated_tokenized_sentences = []
        block.tokenized_sentences.forEach(sentence => {
            if (Object.keys(sentence).length !== 0) {
                updated_tokenized_sentences.push(sentence)
            }
        })
        block.tokenized_sentences   = updated_tokenized_sentences
    })

    tokenized_sentence.src  = merged_sentence
    tokenized_sentence.tgt  = ''
    sorted_selected_blocks[0].tokenized_sentences.splice(sentence_indices[0].index, 0, tokenized_sentence)

    return {'blocks': sorted_selected_blocks, 'sentence_id': sentence_indices[0].s_id, 'sentences': sentence_indices}
}

/**
 *
 * @param {*} sentences, list of all the sentences in which merge operation has to be performed
 * @param {*} block_id, operation performed on specific block
 * @param {*} sentence_id, id of sentence that should under splitting
 * @param {*} character_count,  number of characters to skip before splitting
 *
 * @returns updated block
 */
function do_sentence_splitting(sentences, block_id, sentence_id, character_count) {
    let selected_block_ids          = []
    selected_block_ids.push(block_id)

    let selected_blocks             = get_blocks(sentences, selected_block_ids)
    let tokenized_sentences_block   = get_tokenized_sentences_block(selected_blocks)
    let index                       = get_sentence_id_index(tokenized_sentences_block.tokenized_sentences, sentence_id)

    /**
     * get sentence from the index
     */
    let split_sentence_obj          = tokenized_sentences_block.tokenized_sentences[index]

    /**
     * 0. remove double spaces & trim before counting
     * 1. split src sentence using character_count
     * 2. create two arrays, shift first portion of slice to existing src field
     * 3. create second sentence object with uuid and store both into new array
     * 4. use splice to set the object at index and remove the original sentence & then set another at index + 1
     */
    let actual_text = split_sentence_obj.src.replace(/\s{2,}/g, ' ')
    actual_text     = actual_text.trim()

    let first_portion   = actual_text.slice(0, character_count)
    let second_portion  = actual_text.slice(character_count)

    let final_tokenized_sentences   = []
    split_sentence_obj.src  = first_portion
    final_tokenized_sentences.push(split_sentence_obj)
    final_tokenized_sentences.push({
        'src': second_portion,
        's_id': v4(),
    })

    tokenized_sentences_block.tokenized_sentences.splice(index, 1, final_tokenized_sentences[0])
    tokenized_sentences_block.tokenized_sentences.splice(index+1, 0, final_tokenized_sentences[1])

    return tokenized_sentences_block
}

module.exports = {
    get_merged_blocks,
    do_sentences_merging,
    do_sentences_merging_v1,
    do_sentence_splitting,
    get_sorted_blocks
}
