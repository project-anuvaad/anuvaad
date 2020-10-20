import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Styles from "../../../styles/web/MachineTranslationStyle"
import Typography from '@material-ui/core/Typography';
import CircularProgress from "@material-ui/core/CircularProgress";

class Dictionary extends React.Component {
    // constructor(props) {
    //     super(props);
    //   }

      render() {
        const { classes} = this.props;
        console.log(this.props.parallel_words)
          return(
            <Paper className={ classes.dictionary} >
            <div>
              <Typography variant="h5" gutterBottom className={classes.header} >Dictionary</Typography>
            </div>
          
          <div>
            <hr style={{ border: "1px solid #00000014" }} />
            <div className={classes.div} >
            {!this.props.loading ?  
           window.getSelection().toString() ?  this.props.parallel_words && this.props.parallel_words.map(words=> words):"" :

            <p style={{ textAlign: "center" }} >
                          <CircularProgress
                            size={20}
                            style={{
                              zIndex: 1000,
                            }}
                          />
                          </p>
}


                      
            </div>
           
              
            </div>
    
          </Paper>
          )
      }

}


export default withStyles(Styles)(Dictionary);
