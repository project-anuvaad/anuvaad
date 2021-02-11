import React from 'react';
import { Textfit } from "react-textfit";
import difflib from 'difflib'


const newSentence = {
    src: '',
    visited: false
}
function get_overlap_v1(s1, s2) {
    if (s1.length > s2.length) {
        return get_diff(s1, s2)
    }
    return get_diff(s2, s1)
}

function get_diff(s1, s2) {
    let s = new difflib.SequenceMatcher(null, s1, s2);
    let arr = s.findLongestMatch(0, s1.length, 0, s2.length);
    return {
        matched: s1.substring(arr[0], arr[0] + arr[2]),
    }
}

function sliceSentence(block_sentence, data, text) {
    if (block_sentence.trim().indexOf(data.matched) === 0) {
        if (text.substr(0, text.indexOf(data.matched)).length + data.matched.length === text.length || text.indexOf(data.matched) === 0) {
            newSentence.src = block_sentence.toString().replace(data.matched, '')
            return {
                data: data,
                highlight: true
            }
        }
        else if (data.matched.length === block_sentence.length && block_sentence.includes(data.matched)) {
            return {
                data: data,
                highlight: true
            }
        }
    }
    else {
        let endSentenceArray = text.split(' ').reverse().slice(0, 2)
        let endSentence = endSentenceArray.reverse()
        let val = {
            data: {
                matched: ''
            },
            highlight: false
        }
        endSentence.forEach(word => {
            if (newSentence.src.trim().split(' ')[0] === word) {
                newSentence.src = newSentence.src.toString().replace(word, '')
                let space = val.data.matched === "" ? "" : ' '
                val = {
                    data: {
                        matched: val.data.matched + space + word
                    },
                    highlight: true
                }
            }
        })
        return val
    }
    return {
        data: '',
        highlight: false
    }
}

function recursiveAdjustSentence(block_sentence, text) {
    let data
    if (!newSentence.visited) {
        newSentence.src = block_sentence
        newSentence.visited = true
        data = get_overlap_v1(newSentence.src, text)
        return sliceSentence(newSentence.src, data, text)
    } else {
        data = get_overlap_v1(newSentence.src, text)
        return sliceSentence(newSentence.src, data, text)
    }
}

const sentenceHighlight = (block_highlight, text, merged_block_id, renderTextSpan) => {
    if (block_highlight && block_highlight.src && (block_highlight.block_identifier === text.block_identifier || block_highlight.block_identifier === merged_block_id)) {
        let result = recursiveAdjustSentence(block_highlight.src, text.text)
        if (result.highlight) {
            let firstHalf = Object.assign({}, text)
            let secondHalf = Object.assign({}, text)
            let thirdHalf = Object.assign({}, text)
            firstHalf.text = text.text.substr(0, text.text.lastIndexOf(result.data.matched))
            secondHalf.text = text.text.substr(text.text.lastIndexOf(result.data.matched), result.data.matched.length)
            thirdHalf.text = text.text.substr(firstHalf.text.length + secondHalf.text.length)
            return (
                <Textfit mode="single" style={{ width: parseInt(text.text_width), color: text.font_color }} min={1} max={text.font_size ? parseInt(text.font_size) : 16} >
                    {renderTextSpan(firstHalf)}
                    {renderTextSpan(secondHalf, true)}
                    {renderTextSpan(thirdHalf)}
                </Textfit>
            )
        }
    } else {
        newSentence.src = ''
        newSentence.visited = false
    }
    return (
        <Textfit mode="single" style={{ width: parseInt(text.text_width), color: text.font_color }} min={1} max={text.font_size ? parseInt(text.font_size) : 16} >
            {renderTextSpan(text)}
        </Textfit>
    )
}



export default sentenceHighlight;