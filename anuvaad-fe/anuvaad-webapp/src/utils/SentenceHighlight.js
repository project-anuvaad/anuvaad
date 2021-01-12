import React from 'react';
import { Textfit } from "react-textfit";
import difflab from 'difflib'

const sentenceHighlight = (block_highlight, text, merged_block_id, renderTextSpan) => {
    if (block_highlight && block_highlight.src && (block_highlight.block_identifier === text.block_identifier || block_highlight.block_identifier === merged_block_id)) {
        let s = new difflab.SequenceMatcher(null, block_highlight.src, text.text)
        if (s.a.replace(/\s{2,}/g, ' ').trim().toLowerCase().includes(s.b.replace(/\s{2,}/g, ' ').trim().toLowerCase())) {
            return (
                <Textfit mode="single" style={{ width: parseInt(text.text_width), color: text.font_color }} min={1} max={text.font_size ? parseInt(text.font_size) : 16} >
                    {renderTextSpan(text, true)}
                </Textfit>
            )
        } else {
            let blocks = s.getMatchingBlocks();
            let position = blocks[0][2]
            let colorText = text.text.substr(0, position)
            if (block_highlight.src.replace(/\s{2,}/g, ' ').includes(colorText.trim()) && colorText != "" && position > 1) {
                let coloredText = Object.assign({}, text)
                let nonColoredText = Object.assign({}, text)
                coloredText.text = colorText
                nonColoredText.text = text.text.substr(position)
                return (
                    <Textfit mode="single" style={{ width: parseInt(text.text_width), color: text.font_color }} min={1} max={text.font_size ? parseInt(text.font_size) : 16} >
                        {renderTextSpan(coloredText, true)}
                        {renderTextSpan(nonColoredText)}
                    </Textfit>
                )
            } else {
                let blocks = s.getMatchingBlocks();
                let position = blocks[0][1]
                let colorText = text.text.substr(position)
                if (block_highlight.src.replace(/\s{2,}/g, ' ').includes(colorText.trim()) && colorText != "" && position > 1) {
                    let coloredText = Object.assign({}, text)
                    let nonColoredText = Object.assign({}, text)
                    coloredText.text = colorText
                    nonColoredText.text = text.text.substr(0, position)
                    return (
                        <Textfit mode="single" style={{ width: parseInt(text.text_width), color: text.font_color }} min={1} max={text.font_size ? parseInt(text.font_size) : 16} >
                            {renderTextSpan(nonColoredText)}
                            {renderTextSpan(coloredText, true)}
                        </Textfit>
                    )
                } else {
                    let blocks = s.getMatchingBlocks();
                    let startPosition = blocks[0][1]
                    let endPosition = blocks[0][2]
                    let colorText = text.text.substr(startPosition, endPosition)
                    if (block_highlight.src.replace(/\s{2,}/g, ' ').includes(colorText.trim()) && colorText != "" && startPosition > 1 && endPosition > 2) {
                        let coloredText = Object.assign({}, text)
                        let firstHalf = Object.assign({}, text)
                        let secondHalf = Object.assign({}, text)
                        coloredText.text = colorText
                        firstHalf.text = text.text.substr(0, startPosition)
                        secondHalf.text = text.text.substr(startPosition + endPosition)
                        return (
                            <Textfit mode="single" style={{ width: parseInt(text.text_width), color: text.font_color }} min={1} max={text.font_size ? parseInt(text.font_size) : 16} >
                                {renderTextSpan(firstHalf)}
                                {renderTextSpan(coloredText, true)}
                                {renderTextSpan(secondHalf)}
                            </Textfit>
                        )
                    }
                }
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