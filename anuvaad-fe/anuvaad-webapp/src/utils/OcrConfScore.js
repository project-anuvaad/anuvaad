import React from 'react';

const reactStringReplace = require('react-string-replace')

export const confscore = (line, percent) => {
    let ocrLine = Object.assign(line)
    let space = '\xa0'
    let result = ocrLine.text.split(' ').join(space.repeat(1))
    if (ocrLine.children) {
        ocrLine.children.forEach(word => {
            if (word.conf < percent) {
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
        <span>{result}</span>
    )
}