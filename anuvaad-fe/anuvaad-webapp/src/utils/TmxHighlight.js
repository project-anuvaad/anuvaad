import React from 'react';

const getHighlightedSentence = (src, nextWord, nextColor) => {
    let wordArr = nextWord.split(' ')
    let found = false
    return (typeof src === 'string' ? src.split(' ').map(word => {
        wordArr.map(val => {
            if (val === word) {
                return <span style={{ backgroundColor: nextColor, color: "white" }}>{`${val} `}</span>
            }
            return `${word} `
        })
    }) :
        src.map(word => {
            wordArr.map(val => {
                if (val === word) {
                    return <span style={{ backgroundColor: nextColor, color: "white" }}>{`${val} `}</span>
                }
                return `${word} `
            })
        })
    )
}

export const showTmxIndicator = (source, tmxArr) => {
    var randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    let modifiedSentence = source
    tmxArr.forEach(val => {
        modifiedSentence = getHighlightedSentence(modifiedSentence, val.src_phrase, randomColor)
    })
    return modifiedSentence
}