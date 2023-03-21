const refactorSourceJSONnew = (sourceJson) => {
    // console.log('sourceJson', sourceJson)
    // let index = -1
    let refactoredOutput = []
    // sourceJson.pages.forEach((src, i) => {
        // console.log('src ============>', src)
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
    // })
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
    let rowsarr = []
    let collen = data.columns
    let rowlen = data.regions.length - collen

    data.regions.forEach(cell => {
        let celltext = []
        let tgt = ''
        if(cell.regions.length > 1 ){
            cell.regions.forEach( txt => {
                celltext.push(txt.text)
            })
            tgt = celltext.join(' ')
        } else if(cell.regions.length === 1 ) {
            tgt = cell.regions[0].text
        } else {
            tgt = ''
        }

        if(columns.length !== collen) {
            columns.push({
                val: tgt,
                opts: {
                    align: 'left',
                    b: false,
                    cellColWidth: 1800,
                    sz: '20',
                    fontFamily: cell.font_family ? cell.font_family : 'Arial Unicode MS',
                }
            })
        } else if(columns.length === collen) {
            rowsarr.push({
                val: tgt,
                opts: {
                    align: 'left',
                    b: false,
                    cellColWidth: 1800,
                    sz: '20',
                    fontFamily: cell.font_family ? cell.font_family : 'Arial Unicode MS',
                }
            })
        }
    })

    if (rowsarr.length === rowlen) {
        rowsarr.forEach(cell => {
            rows.push(cell)
            if (columns.length) {
                tableArray.push(columns)
                columns = []
            }
            if (rows.length === collen) {
                tableArray.push(rows)
                rows = []
            }
        })
    }
    return tableArray;
}

module.exports = {
    refactorSourceJSONnew,
    generateTableArray
}