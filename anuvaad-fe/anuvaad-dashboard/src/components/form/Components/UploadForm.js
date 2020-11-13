import React, { Component } from "react";
import LocalizedStrings from "react-localization";
import { translations } from "../../../translations.js";
// import S3 from "../../../helpers/s3";
// const $ = window.$;

let strings = new LocalizedStrings(translations);

class UploadForm extends Component {
  constructor(props) {
    super(props);
    this.state = { language: "en" };
    this.uploadFile = this.uploadFile.bind(this);
    this.manageFileSelection = this.manageFileSelection.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  uploadFile = (event) => {
    event.preventDefault();
    let file = event.target.file.files[0];
    if (file) {
      console.log(file);
      // let fileName = file.name,
      //   fileDirectory = "rain";
      // S3.uploadFile(file, fileName, fileDirectory);
    }
  };

  manageFileSelection = (event) => {
    document.getElementById("file").click();
  };

  handleFileChange = (event) => {
    document.getElementById("uploadFile").value = event.target.files[0].name;
  };

  render() {
    strings.setLanguage(
      localStorage.getItem("language") || this.state.language
    );
    return (
      <div className="row pt-4 mt-4">
        <div className="col-12">
          <form onSubmit={(event) => this.uploadFile(event)} className="pb-4">
            <div className="form-group has-search">
              <div className="row col-12">
                <div className="col-md-4">
                  <label htmlFor="file">{strings.uploadFile}(.xcl, .csv)</label>
                  <i className="material-icons upload form-control-feedback">
                    file_upload
                  </i>
                  <input
                    type="text"
                    className="form-control input-bg-2"
                    id="uploadFile"
                    placeholder={strings.browseForFile}
                    onClick={(event) => this.manageFileSelection(event)}
                    readOnly
                  />
                  <input
                    type="file"
                    id="file"
                    style={{ display: "none" }}
                    className="form-control"
                    onChange={(event) => this.handleFileChange(event)}
                    accept=".xlsx, .xls, .csv"
                  />
                </div>
                <div className="col-md-2">
                  <button
                    type="submit"
                    id="submit"
                    className="btn theme upload-btn"
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </form>
          <div className="col-12">
            <h6>{strings.recentUploads}</h6>
            <table className="table borderless table-striped users-list">
              <thead>
                <tr>
                  <th width="33.33%" scope="col"></th>
                  <th width="33.33%" scope="col"></th>
                  <th width="33.33%" scope="col"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <img src="/img/csv.png" alt="" /> Filename.csv
                  </td>
                  <td>Ajay Gosh</td>
                  <td>Uploaded on 11/03/220</td>
                </tr>
                <tr>
                  <td>
                    <img src="/img/csv.png" alt="" /> Filename.csv
                  </td>
                  <td>Ajay Gosh</td>
                  <td>Uploaded on 11/03/220</td>
                </tr>
                <tr>
                  <td>
                    <img src="/img/csv.png" alt="" /> Filename.csv
                  </td>
                  <td>Ajay Gosh</td>
                  <td>Uploaded on 11/03/220</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default UploadForm;
