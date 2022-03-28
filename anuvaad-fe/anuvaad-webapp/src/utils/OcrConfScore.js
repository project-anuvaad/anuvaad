import React from 'react';

export const confscore = (line, region) => {
    let ocrLine = JSON.parse(JSON.stringify(line))
    let result = []
    if (ocrLine.children) {
        ocrLine.children.forEach(word => {
            if (word.font && word.font.style === 'BOLD') {
                result.push(
                    <span style={{ fontWeight: 'bold', fontSize: `${line.avg_size}px` }}>{`${word.text} `}</span>)
            } else {
                result.push(`${word.text} `)
            }
        })
    }
    return result
}