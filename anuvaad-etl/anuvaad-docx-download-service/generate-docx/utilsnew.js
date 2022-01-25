const refactorSourceJSONnew = (sourceJson) => {
    // console.log('sourceJson', sourceJson)
    let index = -1
    let refactoredOutput = []
    sourceJson.pages.forEach((src, i) => {
        // console.log('src ============>', src)
        // console.log('i =================>', i)
        // src.text_blocks && src.text_blocks.forEach(val => {
        //     if ((val.attrib !== null && val.attrib.indexOf('TABLE') === -1) || val.attrib === null) {
        //         index = -1
        //         refactoredOutput.push(val)
        //     } else if (val.attrib.indexOf('TABLE') !== -1) {
        //         if (index !== val.table_index) {
        //             refactoredOutput.push({ attrib: 'TABLE_DATA', index: val.table_index, childrens: [val], text_top: val.text_top, page_info: val.page_info })
        //             index = val.table_index
        //         } else {
        //             refactoredOutput[refactoredOutput.length - 1].childrens && refactoredOutput[refactoredOutput.length - 1].childrens.push(val)
        //         }
        //     }
        // })
        // src.images.forEach(image => {
        //     if (image.attrib === 'IMAGE')
        //         refactoredOutput.push(image)
        // })
    })
    refactoredOutput = sortData(sourceJson.pages)
    return refactoredOutput;
}

const sortData = (data) => {
    let sortedData = Array.isArray(data) ? data.sort((a, b) => {
        if (a['page_no'] === b['page_no'])
            return a.text_top - b.text_top
    }) : []
    return sortedData;
}
const generateTableArray = (data) => {
    let tableArray = []
    let columns = []
    let rows = []
    let row_index = 0
    data.childrens.forEach(child => {
        let tgt = child.tokenized_sentences !== undefined ? child.tokenized_sentences.map(val => val.tgt) : []
        if (child.cell_index[0] === 0) {
            columns.push({
                val: tgt.join(' '),
                opts: {
                    b: false,
                    sz: child.font_size + 'pt',
                    fontFamily: child.font_family
                }
            })
        } else if (row_index !== child.cell_index[0]) {
            if (columns.length) {
                tableArray.push(columns)
            }

            if (rows.length) {
                tableArray.push(rows)
                rows = []
            }

            rows.push(tgt.join(' '))
            row_index = child.cell_index[0]
        } else if (row_index === child.cell_index[0]) {
            rows.push(tgt.join(' '))
            columns = []
        }
    })
    if (rows.length) {
        tableArray.push(rows);
        rows = []
    } else if (columns.length) {
        tableArray.push(columns)
        columns = []
    }
    return tableArray;
}

module.exports = {
    refactorSourceJSONnew,
    generateTableArray
}