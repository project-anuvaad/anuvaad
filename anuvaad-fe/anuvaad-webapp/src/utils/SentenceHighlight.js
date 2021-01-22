import React from 'react';
import { Textfit } from "react-textfit";
import difflib from 'difflib'

const sentenceHighlight = (block_highlight, text, merged_block_id, renderTextSpan) => {
    if (block_highlight && block_highlight.src && (block_highlight.block_identifier === text.block_identifier || block_highlight.block_identifier === merged_block_id)) {
        let firstHalf = Object.assign({}, text)
        let secondHalf = Object.assign({}, text)
        let finalHalf = Object.assign({}, text)
        let firstWordIndex
        // console.log(text.text, block_highlight.src)
        if (block_highlight.src.includes(text.text)) {
            return (
                <Textfit mode="single" style={{ width: parseInt(text.text_width), color: text.font_color }} min={1} max={text.font_size ? parseInt(text.font_size) : 16} >
                    {renderTextSpan(text, true)}
                </Textfit>
            )
        } else if (block_highlight.src.includes(text.text.split(' ')[0])) {
            firstWordIndex = block_highlight.src.indexOf(text.text.split(' ')[0])
            firstHalf.text = block_highlight.src.substr(firstWordIndex)
            secondHalf.text = text.text.replace(firstHalf.text, '')
            if (text.text.includes(firstHalf.text)) {
                if (text.text.indexOf(firstHalf.text) === 0) {
                    return <Textfit mode="single" style={{ width: parseInt(text.text_width), color: text.font_color }} min={1} max={text.font_size ? parseInt(text.font_size) : 16} >
                        {renderTextSpan(firstHalf, true)}
                        {renderTextSpan(secondHalf)}
                    </Textfit>
                }
            }
        } else if (text.text.includes(block_highlight.src.split(' ')[0])) {
            firstHalf.text = text.text.substr(0, text.text.indexOf(block_highlight.src.split(' ')[0]))
            secondHalf.text = text.text.substr([...firstHalf.text].length, [...block_highlight.src].length)
            finalHalf.text = text.text.substr([...firstHalf.text].length + [...secondHalf.text].length)
            if (block_highlight.src.includes(secondHalf.text)) {
                return <Textfit mode="single" style={{ width: parseInt(text.text_width), color: text.font_color }} min={1} max={text.font_size ? parseInt(text.font_size) : 16} >
                    {renderTextSpan(firstHalf)}
                    {renderTextSpan(secondHalf, true)}
                    {renderTextSpan(finalHalf)}
                </Textfit>
            }
        }
    }
    return (
        <Textfit mode="single" style={{ width: parseInt(text.text_width), color: text.font_color }} min={1} max={text.font_size ? parseInt(text.font_size) : 16} >
            {renderTextSpan(text)}
        </Textfit>
    )
}



export default sentenceHighlight;