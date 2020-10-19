import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = theme => ({
  card: {
    marginTop: "19px"
  },
  media: {
    height: 0,
    paddingTop: "56.25%"
  },
  actions: {
    display: "flex"
  },
  expand: {
    transform: "rotate(0deg)"
  },
  expandOpen: {
    transform: "rotate(180deg)"
  }
});

class RecipeReviewCard extends React.Component {
  state = { expanded: false };

  render() {
    const { header, body, style, expanded, cardKey } = this.props;
    const { classes } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader
          style={style}
          action={
            <IconButton
              className={classnames(classes.expand, {
                [classes.expandOpen]: expanded
              })}
              onClick={
                this.props.handleExpandClick && body
                  ? () => {
                      this.props.handleExpandClick(cardKey, body);
                    }
                  : ""
              }
              aria-expanded={expanded}
              aria-label="Show more"
            >
              {body ? <ExpandMoreIcon /> : <CircularProgress color="black" />}
            </IconButton>
          }
          titleTypographyProps={{ variant: "h4" }}
          title={header}
        />

        <Collapse in={this.props.expanded}>
          <CardContent>
            {!body && (
              <Typography color="#4c4c4c" style={{ fontSize: "32px", textAlign: "left" }}>
                Loading...
              </Typography>
            )}
            {body && (
              <Typography color="#4c4c4c" style={{ fontSize: "32px", textAlign: "left" }}>
                {Array.isArray(body)
                  ? body.map(b => b)
                  : body}
              </Typography>
            )}
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

RecipeReviewCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RecipeReviewCard);
