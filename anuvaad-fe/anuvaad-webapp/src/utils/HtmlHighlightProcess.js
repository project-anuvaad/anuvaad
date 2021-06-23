export const pattern = '( |<([^>]+)>+|&[a-z]+;|[_,;*+?^${}()|[\\]\\\\]||<(\\/[a-z])+>|\n+)+';
export const highlightSource = (source, color, id, highlightSentence, paper) => {
    let regExpSource = source.replace(/[|,|\.|\-]+/g,' ').split(' ').join(pattern)
    if (regExpSource[regExpSource.length - 1] === '.') {
        regExpSource = regExpSource.substr(0, regExpSource.length - 1)
    }
    console.log(regExpSource)
    regExpSource = new RegExp(regExpSource, 'gm')
    let m;
    let regArr = [];
    while ((m = regExpSource.exec(paper.replace(/\n/g," "))) !== null) {
        regArr.push(m)
    }
    let matchArr = regArr[regArr.length - 1]
    let startIndex = matchArr && matchArr.index
    let totalLen = 0
    if (matchArr) totalLen += matchArr[0].length
    if (startIndex >= 0) {
        highlightSentence(paper, startIndex, totalLen, color, id)
    }
    else {
        let regExpArr = source.split(' ')
        let regExpSource = getInitialText(regExpArr, pattern)
        regExpSource = new RegExp(regExpSource, 'gm')
        let m;
        let regArr = [];
        while ((m = regExpSource.exec(paper)) !== null) {
            regArr.push(m)
        }
        let matchArr = regArr[regArr.length - 1]
        let startIndex = matchArr && matchArr.index
        let totalLen = 0
        if (matchArr) totalLen += matchArr[0].length
        if (startIndex >= 0) {
            highlightSentence(paper, startIndex, totalLen, '#e1f5b3', id)
        }
    }
}

export const getInitialText = (arr, pattern) => {
    let str = ""
    let i = 0
    while (i <= 2) {
        str = str + arr[i] + pattern
        i++;
    }
    return str;
}