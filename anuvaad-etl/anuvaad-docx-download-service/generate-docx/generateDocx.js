const officegen = require('officegen')
const fs = require('fs')
const { generateTableArray } = require('./utils');

const generateDocx = (fname) => {

    let docx = officegen({
        type: 'docx',
        orientation: 'portrait',
        pageMargins: { top: 1000, left: 1000, bottom: 1000, right: 500 }
    })

    docx.on('finalize', function (written) {
        console.log(
            'Finish to create a Microsoft Word document.'
        )
    })

    docx.on('error', function (err) {
        console.log(err)
    })

    let sourceJson = fs.readFileSync('./source.json', { encoding: 'utf-8' })
    let parsedSource = JSON.parse(sourceJson)

    parsedSource.forEach((tokens, i) => {
        const is_bold = (tokens.attrib !== null && tokens.attrib.indexOf('BOLD') !== -1) ? true : false;
        const is_table = tokens.attrib === 'TABLE_DATA' ? true : false
        const { font_color, font_size, text_left, font_family } = tokens
        let pObj = docx.createP();
        if (!is_table) {
            tokens.tokenized_sentences && tokens.tokenized_sentences.forEach(token => {
                pObj.addText(token.tgt, {
                    font_size: font_size - 3,
                    color: font_color,
                    font_face: font_family,
                    bold: is_bold,
                })
                pObj.options.indentLeft = `${text_left - 100}pt`;
            })
        }
        else {
            let tableArray = generateTableArray(tokens);
            const style = {
                '@w:val': 'single',
                '@w:sz': '3',
                '@w:space': '1',
            }
            const borderStyle = {
                'w:top': style,
                'w:bottom': style,
                'w:left': style,
                'w:right': style,
                'w:insideH': style,
                'w:insideV': style,
            }
            const tableStyle = {
                tableColWidth: 3261,
                tableSize: 24,
                tableAlign: 'center',
                borderStyle: borderStyle
            }
            docx.createTable(tableArray, tableStyle);
        }
    })

    out = fs.createWriteStream(fname)
    out.on('error', function (err) {
        console.log(err)
    })

    // Async call to generate the output file:
    docx.generate(out)
}

module.exports = { generateDocx }