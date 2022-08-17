import React from 'react';
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withRouter } from 'react-router-dom';
import FetchJobDetail from '../../../../flux/actions/apis/view_scheduled_jobs/fetch_annotator_job';
import APITransport from '../../../../flux/actions/apitransport/apitransport';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Header from './SentenceCardHeader';
import Spinner from "../../../components/web/common/Spinner";
import GradeSentence from '../../../../flux/actions/apis/user/grade_sentence';
import Snackbar from "../../../components/web/common/Snackbar";
import fetchUserJob from '../../../../flux/actions/apis/user/fetch_user_job';
import history from "../../../../web.history";
import clearAnnotatorJob from '../../../../flux/actions/apis/view_scheduled_jobs/clear_task';

const styles = {
    card_open: {
        background: "rgb(206, 231, 236)"
    },

}

const theme = createMuiTheme({
    overrides: {
        MuiCardContent: {
            root: {
                padding: '0px',
                paddingLeft: '10px',
                "&:first-child": {
                    paddingTop: '10px',
                },
                "&:last-child": {
                    paddingBottom: 0,
                },

            },
        },
        MuiDivider: {
            root: {
                marginTop: '-10px',
                marginBottom: '10px'
            }
        }
    },
});

class SentenceCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            score: 0,
            annotationId: 0,
            showLoader: false,
            open: false,
            message: null,
            variantType: null
        }
    }

    componentDidMount() {
        this.setState({ showLoader: true })
        let { APITransport } = this.props
        let apiObj = new FetchJobDetail(this.props.match.params.taskId)
        APITransport(apiObj)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.job_detail.length !== this.props.job_detail.length) {
            this.setState({ showLoader: false })
        }
        if (this.props.job_detail.length !== 0 && this.state.showLoader) {
            this.setState({ showLoader: false })
        }
        if (this.state.open) {
            setTimeout(() => this.setState({ open: false, message: null, variantType: null }), 3000)
        }
        if (prevProps.updatedId !== this.props.updatedId) {
            let { APITransport } = this.props
            let apiObj = new fetchUserJob();
            let apiObj1 = new FetchJobDetail(this.props.match.params.taskId)
            APITransport(apiObj);
            APITransport(apiObj1);
            this.setState({
                open: true,
                message: 'Feedback saved successfully',
                variantType: 'success',
            })
        }
        if (this.props.total_count !== 0 && this.props.total_count === this.props.saved_count && this.props.taskId === this.props.match.params.taskId) {
            this.props.clearAnnotatorJob()
            history.push(`${process.env.PUBLIC_URL}/view-annotation-job`)
        }
    }

    handleChange = (event, id) => {
        event.preventDefault();
        this.setState({
            score: Number(event.target.value),
            annotationId: id
        }, () => {
        })
    }

    renderRating = (id) => {
        let styles = {
            dividerStyle: {
                border: 0,
                height: 0,
                borderTop: "1px solid rgba(0, 0, 0, 0.1)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.3)"
            },
            buttonStyle: {
                color: 'rgb(28, 154, 183)'
            },
            label: {
                fontSize: "5px"
            }
        }
        return (
            <div style={{ padding: "2% 0%" }}>
                <hr style={styles.dividerStyle} />
                <FormControl component="fieldset">
                    <FormLabel component="legend" color="primary" style={{ color: '#000000' }}>Rate machine translation</FormLabel>
                    <RadioGroup color="primary" name="gender1" value={this.state.annotationId === id ? this.state.score : 0} onChange={(e) => this.handleChange(e, id)} style={{ display: "flex", flexDirection: "row" }}>
                        <FormControlLabel value={1} control={<Radio style={styles.buttonStyle} />} label="1" labelPlacement="bottom" style={styles.label} />
                        <FormControlLabel value={2} control={<Radio style={styles.buttonStyle} />} label="2" labelPlacement="bottom" />
                        <FormControlLabel value={3} control={<Radio style={styles.buttonStyle} />} label="3" labelPlacement="bottom" />
                        <FormControlLabel value={4} control={<Radio style={styles.buttonStyle} />} label="4" labelPlacement="bottom" />
                        <FormControlLabel value={5} control={<Radio style={styles.buttonStyle} />} label="5" labelPlacement="bottom" />
                    </RadioGroup>
                </FormControl>
                <hr style={styles.dividerStyle} />
            </div>
        )
    }

    renderNormaModeButtons = () => {
        return (
            <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                <Button variant="outlined" color="primary" style={{ marginRight: '10px', border: '1px solid #2C2799', color: "#2C2799" }}
                    onClick={() => this.saveRating(this.state.annotationId, this.state.score)} >
                    SAVE
                </Button>
            </div>
        )
    }

    saveRating = (id, score) => {
        if (id === 0 && score === 0) {
            this.setState({ open: true, message: 'Please select a value before saving', variantType: 'error' })
        } else {
            let { APITransport } = this.props
            let apiObj = new GradeSentence(id, score);
            APITransport(apiObj)
            this.setState({ annotationId: 0, score: 0, open: true, message: 'Saving your feedback', variantType: 'info' })
        }
    }

    renderSentenceCard = (job) => {
        if (!job.saved) {
            return (
                <div key={job.annotationId} style={{ padding: "1%" }}>
                    <MuiThemeProvider theme={theme} >
                        <Card style={styles.card_open}>
                            <CardContent style={{ display: "flex", flexDirection: "row", padding: "10px" }}>
                                <div style={{ width: "90%" }}>
                                    {job.source}
                                </div>
                            </CardContent>
                            <CardContent style={{ padding: "10px" }}>
                                <div>
                                    <Divider />
                                    <Typography variant="subtitle1" gutterBottom>
                                        {job.target}
                                    </Typography>
                                </div>
                                {this.renderRating(job.annotationId)}
                            </CardContent>
                            <CardActions style={{ padding: "10px" }}>
                                {this.renderNormaModeButtons()}
                            </CardActions>
                        </Card>
                    </MuiThemeProvider>
                </div>
            )
        }
        return <div key={job.annotationId}></div>
    }

    handleClose = () => {
        this.setState({ open: false, message: null, variantType: null })
    }
    processSnackBar = () => {
        return (
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={this.state.open}
                autoHideDuration={3000}
                onClose={this.handleClose}
                variant={this.state.variantType}
                message={this.state.message}
            />
        );
    }

    render() {
        return (
            <div style={{ height: window.innerHeight, overflow: 'auto' }}>
                <div style={{ marginTop: '3%' }}>
                <Header total_count={this.props.total_count} saved_count={this.props.saved_count} />
                    {
                        this.state.showLoader ?
                            <Spinner /> :
                            this.props.job_detail.map(job => this.renderSentenceCard(job))
                    }
                </div>
                {this.state.open && this.processSnackBar()}
            </div>

        )
    }
}

const mapStateToProps = state => {
    return {
        job_detail: state.taskdetail.result,
        updatedId: state.taskdetail.updatedid,
        fetchuserjob: state.fetchuserjob,
        saved_count: state.taskdetail.save_count,
        total_count: state.taskdetail.total_count,
        taskId: state.taskdetail.taskId
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        APITransport,
        clearAnnotatorJob
    },
        dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SentenceCard));