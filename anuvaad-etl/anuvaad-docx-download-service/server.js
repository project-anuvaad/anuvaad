const express = require("express");
const app = express();
const fs = require("fs");
const { generateDocx } = require("./generate-docx/generateDocx");
const { generateDocxNew } = require("./generate-docx/generateDocxNew");

const https = require("https");
const http = require("http");
const { refactorSourceJSON } = require("./generate-docx/utils");
const { refactorSourceJSONnew } = require("./generate-docx/utilsnew");
const bodyParser = require("body-parser");
const path = require("path");
// const { HOSTNAME } = require("./config/end-point-config");
const HOSTNAME = process.env.NODE_HOSTNAME || "anuvad"
// const  cors = require("cors")


if(HOSTNAME === 'anuvad') {
  console.log("Node hostname is not found");
}

console.log("server.js called");
app.use(bodyParser.json());

app.use((req, res, next) => {
  next();
});

// app.use(cors())

app.post(
  "/anuvaad-etl/anuvaad-docx-downloader/v0/download-docx",
  (request, response) => {
    console.log("inside download-docx");
    let { fname, jobId, authToken, jobName } = request.body;
    jobName = jobName.substr(0, jobName.lastIndexOf("."));
    console.log(jobName);
    let data = "";
    var options = {
      hostname: HOSTNAME,
      path: `/anuvaad/content-handler/v0/fetch-content?record_id=${jobId}&start_page=0&end_page=0`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": authToken,
      },
      // port: "5001",
    };
    console.log("calling content-handler");
    console.log("options", options);

    var req = http.request(options, (res) => {
      console.log("res", res, options);
      if (res.statusCode === 200) {
        console.log("inside Status code 200", res.statusCode);
        res.on("data", (d) => {
          data = data + d.toString();
        });

        res.on("end", (e) => {
          console.log("finished reading data");
          data = JSON.stringify(refactorSourceJSON(JSON.parse(data).data));
          console.log("saving response to file");
          fs.writeFile("./upload/source.json", data, async (err) => {
            if (!err) {
              try {
                console.log("inside try");
                generateDocx(jobName, fname, data.page_height, data.page_width);
                fs.readFile(
                  `./upload/${jobName}_${fname}`,
                  { encoding: "utf-8" },
                  (err, data) => {
                    setTimeout(() => {
                      console.log("inside setTimeout");
                      response.sendFile(
                        path.join(__dirname, `./upload/${jobName}_${fname}`)
                      );
                    }, 2000);
                  }
                );
              } catch (e) {
                console.log("inside catch");
                response.status(400).send({
                  http: {
                    status: 400,
                  },
                  ok: false,
                  translated_document: "",
                  why: "Conversion failed",
                });
              }
            }
          });
        });
        data = "";
      } else {
        console.log("inside else, Failed fetching data");
        response.status(res.statusCode).send({
          http: {
            status: res.statusCode,
          },
          ok: false,
          translated_document: "",
          why: "Failed fetching data",
        });
      }
    });

    req.on("error", (e) => {
      console.log("error", e);
      response.status(500).send({
        http: {
          status: 500,
        },
        ok: false,
        translated_document: "",
        why: "Try after sometime",
      });
    });

    req.end();
  }
);

// for digitization docx
app.post(
  "/anuvaad-etl/anuvaad-docx-downloader/ocr/v0/download-docx",
  (request, response) => {
    console.log("inside digitize download-docx");
    let { fname, jobId, authToken, jobName } = request.body;
    const job = `${jobId}|${jobName}`;
    let data = "";
    var options = {
      host: HOSTNAME,
      path: `/anuvaad/ocr-content-handler/v0/ocr/fetch-document?recordID=${encodeURI(
        job
      )}&start_page=0&end_page=0`,
      // method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": authToken,
      },
      // port: "5001",
    };
    console.log('options', options)
    var req = http.get(options, (res) => {
      console.log("res.statusCode", res.statusCode);
      if (res.statusCode === 200) {
        res.on("data", (d) => {
          data = data + d.toString();
        });

        res.on("end", (e) => {
          data = JSON.stringify(refactorSourceJSONnew(JSON.parse(data).data));
          console.log("saving response to file");

          fs.writeFile("./upload/source.json", data, async (err) => {
            if (!err) {
              try {
                console.log("inside try");
                generateDocxNew(
                  jobName,
                  fname,
                  data.page_height,
                  data.page_width
                );
                jobName = jobName.substr(0, jobName.lastIndexOf("."));
                fs.readFile(
                  `./upload/${jobName}_${fname}`,
                  { encoding: "utf-8" },
                  (err, data) => {
                    setTimeout(() => {
                      console.log("inside setTimeout");
                      response.sendFile(
                        path.join(__dirname, `./upload/${jobName}_${fname}`)
                      );
                    }, 2000);
                  }
                );
              } catch (e) {
                console.log("inside catch");
                response.status(400).send({
                  http: {
                    status: 400,
                  },
                  ok: false,
                  translated_document: "",
                  why: "Conversion failed",
                });
              }
            }
          });
        });
        data = "";
      } else {
        console.log("inside else, Failed fetching data");
        response.status(res.statusCode).send({
          http: {
            status: res.statusCode,
          },
          ok: false,
          translated_document: "",
          why: "Failed fetching data",
        });
      }
    });

    req.on("error", (e) => {
      console.log("error", e);
      response.status(500).send({
        http: {
          status: 500,
        },
        ok: false,
        translated_document: "",
        why: "Try after sometime",
      });
    });

    req.end();
  }
);
app.listen(5001);
