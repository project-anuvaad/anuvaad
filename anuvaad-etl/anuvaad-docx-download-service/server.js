const express = require('express');
const app = express()
const fs = require('fs');
const { generateDocx } = require('./generate-docx/generateDocx')
const https = require('https')
const { refactorSourceJSON } = require('./generate-docx/utils');
const bodyParser = require('body-parser');
const path = require('path')
const { HOSTNAME } = require('./config/end-point-config');

app.use(bodyParser.json());

app.use((req, res, next) => {
    next();
})

app.post('/anuvaad-etl/anuvaad-docx-downloader/v0/download-docx', (request, response) => {
    let { fname, jobId, authToken } = request.body
    let data = ""
    var options = {
        hostname: HOSTNAME,
        path: `/anuvaad/content-handler/v0/fetch-content?record_id=${jobId}&start_page=0&end_page=0`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': authToken
        }
    };

    var req = https.request(options, (res) => {
        if (res.statusCode === 200) {
            res.on('data', (d) => {
                data = data + d.toString()
            });

            res.on('end', e => {
                data = JSON.stringify(refactorSourceJSON(JSON.parse(data).data))
                fs.writeFile('./upload/source.json', data, async (err) => {
                    if (!err) {
                        try {
                            generateDocx(fname)
                            fs.readFile(`./${fname}`, { encoding: 'utf-8' }, (err, data) => {
                                setTimeout(() => {
                                    response.sendFile(path.join(__dirname, `./${fname}`))
                                }, 2000)
                            })
                        } catch (e) {
                            response.status(400).send({
                                http: {
                                    status: 400
                                },
                                ok: false,
                                translated_document: "",
                                why: "Conversion failed"
                            })
                        }

                    }
                })
            })
            data = ""
        } else {
            response.status(res.statusCode).send({
                http: {
                    status: res.statusCode
                },
                ok: false,
                translated_document: "",
                why: "Failed fetching data"
            })
        }
    });

    req.on('error', (e) => {
        response.status(500).send({
            http: {
                status: 500
            },
            ok: false,
            translated_document: "",
            why: "Try after sometime"
        })
    });

    req.end();
})
app.listen(5001)
