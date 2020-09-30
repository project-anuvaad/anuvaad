import { DropzoneArea } from 'material-ui-dropzone';
import React, { Component } from 'react';

class DropZone extends Component {


  render() {
    const { handleChange, supportFile } = this.props;
    return (
      // <div style={{textAlign:'center',minWidth:200,marginTop:'20%'}}>
      // <input type="file" accept=".docx" onChange={handleChange} />
      // </div>
      <DropzoneArea
        onDrop={handleChange} maxFileSize={20000000} style={{ marginTop: '20%' }} acceptedFiles={supportFile} dropzoneText="Drop document here or click here to locate the file(.docx)" filesLimit={1}
      ></DropzoneArea>
    )
  }
}

export default DropZone;

