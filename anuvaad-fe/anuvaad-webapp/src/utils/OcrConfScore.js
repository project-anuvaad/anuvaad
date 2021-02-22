import { Textfit } from "react-textfit";
import React from 'react';

const reactStringReplace = require('react-string-replace')

export const confscore = (line, region) => {
    let ocrLine = Object.assign(line)
    let result
    if (ocrLine.children) {
        ocrLine.children.forEach(word => {
            if (word.conf < 75) {
                if (!result) {
                    result = (reactStringReplace(ocrLine.text, word.text, (match, i) => (
                        <span key={i} style={{ color: 'red' }}>{match}</span>
                    )));
                } else {
                    result = (reactStringReplace(result, word.text, (match, i) => (
                        <span key={i} style={{ color: 'red' }}>{match}</span>
                    )));
                }
            }
        })
        if (!result) {
            result = ocrLine.text
        }
    }
    return (
        <Textfit mode="single" style={{ width: '100%' }} min={1} max={parseInt(Math.ceil(region.avg_size * 3))} >
            {result}
        </Textfit>
    )
}