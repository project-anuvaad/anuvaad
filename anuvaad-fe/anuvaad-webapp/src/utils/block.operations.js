var jp                = require('jsonpath')
const { v4 }        = require('uuid');

function get_block_id(blocks) {
    let block_ids = []
    blocks.forEach(element => {
        block_ids.push(element.split('_')[0])
    });
    return block_ids
}

function get_page_id(blocks) {
    let page_ids = []
    blocks.forEach(element => {
        page_ids.push(parseInt(element.split('_')[1]))
    });
    return page_ids
}

function get_blocks(sentences, block_ids) {
    let blocks = []
    block_ids.forEach(element => {
        let condition           = '$..[*].text_blocks[?(@.block_id ==' + '\'' + element + '\'' + ')]'
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
        if (element.block_identifier == largest_block.block_identifier) {
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
    if (tokenized_sentences[i].s_id == sentence_id) {
      return i;
    }
  }
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
    do_sentence_splitting
}
