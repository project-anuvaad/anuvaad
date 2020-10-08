import React from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import SourceView from "./DocumentSource";
import Grid from "@material-ui/core/Grid";
import ClearContent from "../../../../flux/actions/apis/clearcontent";
import MachineTranslation from "./MachineTranslation";
import Spinner from "../../../components/web/common/Spinner";
import Paper from "@material-ui/core/Paper";

import Snackbar from "../../../components/web/common/Snackbar";


const BLOCK_OPS = require("../../../../utils/block.operations");
const TELEMETRY = require('../../../../utils/TelemetryManager')

class PdfFileEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }
  

  
  handleSentence=()=>{
      let sentenceArray= []
        this.props.sentences.map(element=>{

            element.text_blocks.map(sentence=>{
                sentence.tokenized_sentences.map(value=>{
                sentenceArray.push(<div>{value.src}</div>)
                })
            })
        })

        return sentenceArray

  }

  

  

  render() {

    console.log("ypooooo",this.props.sentences)
    return (
      <div>
        {this.props.sentences && (
          <div>
            <Grid
              container
              spacing={2}
              style={{ marginTop: "-20px", padding: "5px 24px 0px ", width: "100%", position: "fixed", zIndex: 1000, background: "#F5F9FA" }}
            >
              <Grid item xs={12} sm={9} lg={9} xl={9}>
                  
                <Paper elevation={3} style={{overflow: 'auto'}}>

                <div
                    id="scrollableDiv"
                    style={
                      {
                          maxHeight: window.innerHeight - 220,
                          overflowY: "auto",
                          // overflowX: "auto"
                        }
                        
                    }
                  >
                  {this.handleSentence()}
                  </div>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={3} lg={3} xl={3}>
              <MachineTranslation/>
              </Grid>
            </Grid>

            <Grid container spacing={2} style={{ padding: "12px 24px 0px 24px" }}>
              <Grid item xs={12} sm={6} lg={6} xl={6}>
                <Paper>
                  
                    
                      
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} lg={6} xl={6}>
                <Paper>
                  
                </Paper>
              </Grid>
            </Grid>
          </div>
        )}
       
        {this.state.open && (
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={this.state.open}
            autoHideDuration={3000}
            variant="success"
            message={this.state.message}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  fetchPdfSentence: state.fetchPdfSentence,
  fileUpload: state.fileUpload,
  documentDetails: state.documentDetails,
  fetchContent: state.fetchContent,
  workflowStatus: state.workflowStatus
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      ClearContent: ClearContent
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PdfFileEditor));
