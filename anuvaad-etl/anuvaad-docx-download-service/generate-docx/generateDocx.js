const officegen = require('officegen')
const fs = require('fs')
const { generateTableArray } = require('./utils');

const generateDocx = (fname, height, width) => {

    let docx = officegen({
        type: 'docx',
        orientation: 'portrait',
        pageSize: {
            width,
            height
        }
    })

    docx.on('finalize', function (written) {
        console.log(
            'Finish to create a Microsoft Word document.'
        )
    })

    docx.on('error', function (err) {
        console.log(err)
    })

    let sourceJson = fs.readFileSync('./upload/source.json', { encoding: 'utf-8' })
    let parsedSource = JSON.parse(sourceJson)

    parsedSource.forEach((tokens, i) => {
        const is_bold = (tokens.attrib !== null && tokens.attrib.indexOf('BOLD') !== -1) ? true : false;
        const is_table = tokens.attrib === 'TABLE_DATA' ? true : false
        const is_image = tokens.attrib === 'IMAGE' ? true : false
        const { font_color, font_size, text_left, font_family } = tokens
        let pObj = docx.createP();
        if (!is_table && !is_image) {
            tokens.tokenized_sentences && tokens.tokenized_sentences.forEach(token => {
                pObj.addText(token.tgt, {
                    font_size: font_size,
                    color: font_color,
                    font_face: font_family,
                    bold: is_bold,
                })
                pObj.options.indentLeft = `${text_left}`;
            })
        }
        else if (is_table && !is_image) {
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
        } else if (is_image) {
            fs.writeFileSync(`./upload/${tokens.block_identifier}.png`, tokens.base64, 'base64')
            pObj.addImage(`./upload/${tokens.block_identifier}.png`, { cx: tokens.text_width, cy: tokens.text_height })
        }
    })

    out = fs.createWriteStream(`./upload/${fname}`)
    out.on('error', function (err) {
        console.log(err)
    })

    // Async call to generate the output file:
    docx.generate(out)
}

module.exports = { generateDocx }