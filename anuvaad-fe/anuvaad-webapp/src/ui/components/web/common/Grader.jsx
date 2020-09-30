import React from "react";
import { withRouter } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import NewCorpusStyle from "../../../styles/web/Newcorpus";
import Typography from "@material-ui/core/Typography";
import StarRatingComponent from "react-star-rating-component";

class Grader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            names: ""
        };
    }

    componentDidMount() {
        this.setState({
            [this.props.meaning + this.props.index]: this.props.data[this.props.meaning] ? this.props.data[this.props.meaning] : 0,
            [this.props.structure + this.props.index]: this.props.data[this.props.structure] ? this.props.data[this.props.structure] : 0,
            [this.props.vocabulary + this.props.index]: this.props.data[this.props.vocabulary] ? this.props.data[this.props.vocabulary] : 0
        });
    }

    onMeaningStarClick(nextValue, prevValue, name) {
        this.setState({ [name + this.props.index]: nextValue });
        this.props.handleStarClick(nextValue, prevValue, name, this.props.index)
    }

    onStructureStarClick(nextValue, prevValue, name) {
        this.setState({ [name + this.props.index]: nextValue });
        this.props.handleStarClick(nextValue, prevValue, name, this.props.index)
    }

    onVocabularyStarClick(nextValue, prevValue, name) {
        this.setState({ [name + this.props.index]: nextValue });
        this.props.handleStarClick(nextValue, prevValue, name, this.props.index)
    }

    render() {
        return (
            <div>
                <Grid container spacing={4} style={{ paddingTop: "20px" }}>
                    <Grid item xs={12} sm={12} lg={12} xl={12} style={{}}>
                        <Typography variant="h6" color="inherit">
                            <b>
                                {this.props.title}
                            </b>
                        </Typography>
                    </Grid>

                    <Grid container>

                        <Grid item xs={12} sm={12} lg={9} xl={9} style={{ flex: 1, marginTop: "20px", marginBottom: "20px" }}>
                            
                            <div style={{minHeight:'80px', width:'130%'}}>
                            {this.props.description}

                            {/* <ReadMoreReact 
                min={200}
                ideal={250}
                max={300}
                readMoreText=".....ReadMore..."/> */}
                            
                        
                            
                            
                                
                                </div>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={3} xl={3}>
                        </Grid>
                    </Grid>


                    <Grid container>
                        <Grid item xs={12} sm={12} lg={8} xl={8} style={{ flex: 1 }}>
                            <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
                                Meaning of sentence:
                        </Typography>
                        </Grid>

                        <Grid item xs={12} sm={12} lg={4} xl={4} style={{ flex: 1, textAlign: "right",marginTop:'-20px',marginRight:'7%' }}>
                            <h1>
                                <StarRatingComponent name={this.props.meaning} starCount={5} value={this.state[this.props.meaning + this.props.index]} onStarClick={this.onMeaningStarClick.bind(this)} />
                            </h1>
                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid item xs={12} sm={12} lg={8} xl={8} style={{ flex: 1 }}>
                            <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
                                Structure/Grammar of Sentence:
                        </Typography>
                        </Grid>


                        <Grid item xs={12} sm={12} lg={4} xl={4} style={{ flex: 1, textAlign: "right",marginTop:'-20px',marginRight:'7%' }}>
                            <h1>
                                <StarRatingComponent name={this.props.structure} starCount={5} value={this.state[this.props.structure + this.props.index]} onStarClick={this.onStructureStarClick.bind(this)} />
                            </h1>
                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid item xs={12} sm={12} lg={8} xl={8} style={{ flex: 1 }}>
                            <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
                                Vocabulary / Lexicon:
                        </Typography>
                        </Grid>

                        <Grid item xs={12} sm={12} lg={4} xl={4} style={{ flex: 1, textAlign: "right",marginTop:'-20px',marginRight:'7%' }}>
                            <h1>
                                <StarRatingComponent name={this.props.vocabulary} starCount={5} value={this.state[this.props.vocabulary + this.props.index]} onStarClick={this.onVocabularyStarClick.bind(this)} />
                            </h1>
                        </Grid>
                    </Grid>

                </Grid>
            </div >
        );
    }
}

export default withRouter(
    withStyles(NewCorpusStyle)(
        (Grader)
    )
);
