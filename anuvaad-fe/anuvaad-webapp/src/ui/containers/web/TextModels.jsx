import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import { withStyles } from "@material-ui/core";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import CardHeader from "@material-ui/core/CardHeader";
import history from "../../../web.history";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import { translate } from "../../../assets/localisation";
import FetchModels from "../../../flux/actions/apis/fetchenchmarkmodel";

const styles = {
  card: {
    width: "80%",
    height: "30vw",
    minHeigth: "30vh",
    maxHeight: "30vh",
    transition: "transform .2s",
    "&:hover": {
      transform: "scale(1.1)"
    }
  },

  CardContent: {
    height: "7vw",
    minHeigth: "7vw",
    maxHeight: "7vw"
  }
};

class TextModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 2
    };
  }

  componentDidMount() {
    const { APITransport } = this.props;
    const api = new FetchModels(1573290229, 17, 5, 1);
    APITransport(api);
    this.setState({ showLoader: true });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.fetchBenchmarkModel !== this.props.fetchBenchmarkModel) {
      this.setState({
        sentences: this.props.fetchBenchmarkModel.data,
        count: this.props.fetchBenchmarkModel.count
      });
    }
  }

  handleClick = (event, index, source) => {
    history.push(`${process.env.PUBLIC_URL}/anuvaad-editor/17`);
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Grid container spacing={8}>
          <Grid container item xs={12} spacing={8} id="cardGrid" style={{ marginLeft: "8%", marginTop: "2%" }}>
            <React.Fragment>
              {this.state.sentences &&
                this.state.sentences.length > 0 &&
                this.state.sentences.map((text, index) => (
                  <Grid key={index} item xs={12} sm={6} className="slideUp" style={{ marginTop: "2%" }}>
                    <Card className={classes.card}>
                      <CardHeader title={index} />
                      <CardContent className={classes.CardContent}>
                        <Typography paragraph>{text.source}</Typography>
                      </CardContent>

                      <CardActions>
                        <Button size="small" color="primary" onClick={event => this.handleClick(event, index, text.source)}>
                          {translate("common.page.placeholder.startWritting")}
                          Start Writing
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
            </React.Fragment>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  fetchBenchmarkModel: state.fetchBenchmarkModel
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      CreateCorpus: APITransport
    },
    dispatch
  );

export default withStyles(styles)(withRouter(connect(mapStateToProps, mapDispatchToProps)(TextModel)));
