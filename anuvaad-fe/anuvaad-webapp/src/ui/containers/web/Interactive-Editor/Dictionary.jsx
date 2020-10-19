import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Styles from "../../../styles/web/MachineTranslationStyle"
import Typography from '@material-ui/core/Typography';

class Dictionary extends React.Component {
    // constructor(props) {
    //     super(props);
    //   }

      render() {
          const { imgObj} = this.props;
          return(
            <Paper  >
            <div>
              <Typography variant="h5" gutterBottom >Dictionary</Typography>
            </div>
         
          <div>
            <hr style={!{ border: "1px solid #00000014" }} />
            <div>
              <div>
               
              </div>
            </div>
            
            <div >
              <div>
                
              </div>
              </div>
              
            </div>
      
          </Paper>
          )
      }

}

export default Dictionary;