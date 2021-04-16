import React from 'react';

const getHighlightedSentence = (src, nextWord, nextColor) => {
    // let wordArr = nextWord.split(' ')
    // let modifiedSentence = []
    // let found = false
    // typeof src === 'string' ? src.split(' ').map(word => {
    //     wordArr.map(val => {
    //         if (val === word) {
    //             found = true
    //             return <span style={{ backgroundColor: nextColor, color: "white" }}>{`${val}`}</span>
    //         }
    //     })
    // }) :
    //     src.map(word => {
    //         wordArr.map(val => {
    //             if (val === word) {
    //                 found = true
    //                 return <span style={{ backgroundColor: nextColor, color: "white" }}>{`${val}`}</span>
    //             }
    //         })
    //     })

    // return modifiedSentence

    let keyword = nextWord;
    let title = src;
    let regex = new RegExp(`${keyword}`, "ig");
    let titleToDisplay = title.replace(regex, <span style={{ backgroundColor: nextColor, color: "white" }}>{keyword}</span>)
    return titleToDisplay
}

export const showTmxIndicator = (source, tmxArr) => {
    var randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    let modifiedSentence = source
    tmxArr.forEach(val => {
        modifiedSentence = getHighlightedSentence(modifiedSentence, val.src_phrase, randomColor)
    })
    return modifiedSentence
}