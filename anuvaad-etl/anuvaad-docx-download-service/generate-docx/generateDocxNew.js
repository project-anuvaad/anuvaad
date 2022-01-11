const officegen = require('officegen')
const fs = require('fs')
const { generateTableArray } = require('./utilsnew');

const generateDocxNew = (jobName,fname, height, width) => {
    // console.log('gd=====')

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
            'Finish to create a Microsoft Word document.', written
        )
    })

    docx.on('error', function (err) {
        console.log('new docx err', err)
    })

    let sourceJson = fs.readFileSync('./upload/source.json', { encoding: 'utf-8' })
    let parsedSource = JSON.parse(sourceJson)

    parsedSource.forEach((pages, p) => {
        pages.regions.forEach((tokens, i) => {
            tokens.top = tokens.boundingBox.vertices[0].y - tokens.boundingBox.vertices[0].x
        })
        pages.regions = sortData(pages.regions)
        console.log('pages', pages)

        pages.regions.forEach((tokens, i) => {
            console.log('inisde ths foreach')

            const is_bold = (tokens.class !== null && tokens.class.indexOf('BOLD') !== -1) ? true : false;
            const is_para = tokens.class === 'PARA' ? true : false
            
            const is_line = tokens.class === 'LINE' ? true : false

            const is_table = tokens.class === 'TABLE_DATA' ? true : false
            const is_image = tokens.class === 'IMAGE' ? true : false
            const { font_color, font_size, text_left, font_family } = tokens
            let pObj = docx.createP();
            if (is_para && !is_table && !is_image) {
                
                console.log('token item =================', tokens)
                // console.log('tokens.tokenized_sentences ****************', tokens.tokenized_sentences)
                
                tokens.tokenized_sentences && tokens.tokenized_sentences.forEach(token => {
                    pObj.addText(token.src, {
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
    })
    jobName = jobName.substr(0, jobName.lastIndexOf("."));
    out = fs.createWriteStream(`./upload/${jobName}_${fname}`)
    out.on('error', function (err) {
        console.log(err)
    })

    out.on('finish', function(err) {
        // This is the real finish in case of creating a document file.
        console.log('finish', err)
     })

    // Async call to generate the output file:
    // console.log('out *******', out)
    docx.generate(out)
}

const sortData = (data) => {
    let sortedData = Array.isArray(data) ? data.sort((a, b) => {
        // if (a['page_no'] === b['page_no'])
            return a.top - b.top
    }) : []
    return sortedData;
}

module.exports = { generateDocxNew }