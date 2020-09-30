import React from 'react';
import Typography from "@material-ui/core/Typography";

export default class GradesScore extends React.Component {
    

    render() {
        var {score} = this.props
        return (
            <div>
                
                <Typography>Meaning of sentence : {score.grammer_grade}</Typography>
                <Typography>Structure of sentence : {score.context_rating}</Typography>
                <Typography>Vocabulary / Lexicon : {score.spelling_rating}</Typography>
                {score.name_accuracy_rating &&<Typography>Names Accuracy : {score.name_accuracy_rating}</Typography>}
            
            </div>
        );
    }
}