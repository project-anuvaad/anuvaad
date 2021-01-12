import React from 'react';
import { Textfit } from "react-textfit";
import difflab from 'difflib'

const sentenceHighlight = (block_highlight, text, merged_block_id, renderTextSpan) => {
        if (block_highlight) {
            let sentence = block_highlight.src;
            if (block_highlight.block_identifier === text.block_identifier || merged_block_id === block_highlight.block_identifier) {
                /*Left and right has the same length */
                if (sentence !== undefined) {
                    if (sentence.replace(/\s/g, '').includes(text.text.replace(/\s/g, '')) || text.text.replace(/\s/g, '').length === sentence.replace(/\s/g, '').length) {
                        return <Textfit mode="single" style={{ width: parseInt(text.text_width), color: text.font_color }} min={1} max={text.font_size ? parseInt(text.font_size) : 16}>
                            {renderTextSpan(text, true)}
                        </Textfit>
                    }
                    /**
                    * Left is greater than right
                    */
                    else if (text.text.replace(/\s/g, '').length > sentence.replace(/\s/g, '').length && text.text.replace(/\s/g, '').includes(sentence.replace(/\s/g, ''))) {
                        if (text.text.replace(/\s/g, '').indexOf(sentence.replace(/\s/g, '')) === 0) {
                            let removedSpaces = JSON.parse(JSON.stringify(text));
                            removedSpaces.text = text.text.replace(/ +/g, '');
                            let coloredText = JSON.parse(JSON.stringify(text));
                            let nonColoredText = JSON.parse(JSON.stringify(text));
                            coloredText.text = sentence
                            nonColoredText.text = ' ' + removedSpaces.text.substr(coloredText.text.length);
                            return <Textfit mode="single" style={{ width: parseInt(text.text_width), color: text.font_color }} min={1} max={text.font_size ? parseInt(text.font_size) : 16}>
                                {renderTextSpan(coloredText, true)}
                                {renderTextSpan(nonColoredText, false)}
                            </Textfit>

                        } else if (text.text.replace(/\s/g, '').indexOf(sentence.replace(/\s/g, '')) > 0) {
                            let removedSpaces = JSON.parse(JSON.stringify(text));
                            removedSpaces.text = text.text.replace(/ +/g, '');
                            let firstHalfText = JSON.parse(JSON.stringify(text));
                            let secondHalfText = JSON.parse(JSON.stringify(text));
                            let coloredText = JSON.parse(JSON.stringify(text));
                            coloredText.text = sentence;
                            firstHalfText.text = removedSpaces.text.substr(0, removedSpaces.text.indexOf(sentence));
                            secondHalfText.text = removedSpaces.text.substr(removedSpaces.text.indexOf(sentence) + sentence.length);
                            return <Textfit mode="single" style={{ width: parseInt(text.text_width), color: text.font_color }} min={1} max={text.font_size ? parseInt(text.font_size) : 16}>
                                {renderTextSpan(firstHalfText, false)}
                                {renderTextSpan(coloredText, true)}
                                {renderTextSpan(secondHalfText, false)}
                            </Textfit>

                        }
                    }
                    /**
                    * When a portion of sentence is present in the text
                    */

                    if (text.text.includes(sentence.split(' ')[0])) {
                        let removedSpaces = JSON.parse(JSON.stringify(text));
                        removedSpaces.text = text.text.replace(/ +/g, '');
                        let tempText = removedSpaces.text.substr(removedSpaces.text.indexOf(sentence.trim().split(' ')[0]));
                        if (sentence.replace(/\s/g, '').includes(tempText.replace(/\s/g, ''))) {
                            let coloredText = JSON.parse(JSON.stringify(text));
                            let nonColoredText = JSON.parse(JSON.stringify(text));
                            coloredText.text = tempText;
                            if (removedSpaces.text.replace(/\s/g, '').indexOf(sentence.split(' ')[0].replace(/\s/g, '')) === 0) {
                                nonColoredText.text = removedSpaces.text.substr(tempText.length);
                                console.log(nonColoredText.text);
                                return (
                                    <Textfit mode="single" style={{ width: parseInt(text.text_width), color: text.font_color }} min={1} max={text.font_size ? parseInt(text.font_size) : 16}>
                                        {renderTextSpan(coloredText, true)}
                                        {renderTextSpan(nonColoredText)}
                                    </Textfit>
                                )
                            } else {
                                nonColoredText.text = removedSpaces.text.substr(0, removedSpaces.text.indexOf(tempText));
                                return (
                                    <Textfit mode="single" style={{ width: parseInt(text.text_width), color: text.font_color }} min={1} max={text.font_size ? parseInt(text.font_size) : 16}>
                                        {renderTextSpan(nonColoredText)}
                                        {renderTextSpan(coloredText, true)}
                                    </Textfit>
                                )
                            }
                        }
                    }
                    /**
                    * When right is greater than left
                    */

                    if (sentence.replace(/\s/g, '').includes(text.text.replace(/\s/g, '')) && text.text.replace(/\s/g, '').length < sentence.replace(/\s/g, '').length) {
                        return <Textfit mode="single" style={{ width: parseInt(text.text_width), color: text.font_color }} min={1} max={text.font_size ? parseInt(text.font_size) : 16}>
                            {renderTextSpan(text, true)}
                        </Textfit>

                    }

                    /**
                    * When a portion of text is present in sentence
                    */
                    if (sentence.replace(/\s/g, '').includes(text.text.split(' ')[0].replace(/\s/g, ''))) {
                        let removedSpaces = JSON.parse(JSON.stringify(text));
                        removedSpaces.text = text.text.replace(/ +/g, '');
                        let tempText = sentence.substr(sentence.indexOf(removedSpaces.text.split(' ')[0]));
                        if (text.text.replace(/\s/g, '').includes(tempText.replace(/\s/g, ''))) {

                            let coloredText = JSON.parse(JSON.stringify(text));
                            let nonColoredText = JSON.parse(JSON.stringify(text));
                            coloredText.text = tempText;
                            if (removedSpaces.text.replace(/\s/g, '').indexOf(tempText.replace(/\s/g, '')) === 0) {
                                nonColoredText.text = removedSpaces.text.substr(tempText.length);
                                return (
                                    <Textfit mode="single" style={{ width: parseInt(text.text_width), color: text.font_color }} min={1} max={text.font_size ? parseInt(text.font_size) : 16}>
                                        {renderTextSpan(coloredText, true)}
                                        {renderTextSpan(nonColoredText)}
                                    </Textfit>
                                )
                            }
                        }
                    }
                    /**
                    * Initial rendering or when block_identifier is not matching
                    */
                }
            }
        }

    return (
        <Textfit mode="single" style={{ width: parseInt(text.text_width), color: text.font_color }} min={1} max={text.font_size ? parseInt(text.font_size) : 16} >
            {renderTextSpan(text)}
        </Textfit >
    )
}

export default sentenceHighlight;