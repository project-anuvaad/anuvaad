const officegen = require('officegen')
const fs = require('fs')
const { generateTableArray } = require('./utilsnew');

const generateDocxNew = (jobName,fname, height, width) => {
    console.log('gd=====')

    let docx = officegen({
        type: 'docx',
        orientation: 'portrait',
        pageMargins: { top: 500, left: 500, bottom: 500, right: 500 },
        pageSize: {
            width,
            height
        },
        
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
            // const is_bold = (tokens.class !== null && tokens.class.indexOf('BOLD') !== -1) ? true : false;
            // const { font_color, text_left, font_family } = tokens
            let pObj = docx.createP();
            if (tokens.class === 'PARA') {
                // const fs = tokens.avg_size * 0.20
                tokens.tokenized_sentences && tokens.tokenized_sentences.forEach(token => {
                    pObj.addText(token.src)
                    // pObj.options.indentLeft = `${text_left}`;
                })
            } else if (tokens.class === 'TABLE') {
                let tableArray = generateTableArray(tokens);

                const tableStyle = {
                    tableColWidth: 3261,
                    tableSize: 1,
                    tableAlign: 'left',
                    tableFontFamily: 'Arial Unicode MS',
                }
                docx.createTable(tableArray, tableStyle);
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