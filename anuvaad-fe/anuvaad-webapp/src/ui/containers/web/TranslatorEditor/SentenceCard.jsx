import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField'
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';

const classes = {
    root: {
      minWidth: 275,
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    divider: {
        margin: '20 20px',
    },
  }

  class SentenceCard extends React.Component {

    addChips = (tags) => {
        if (tags && tags.length > 1) {
            return (
                tags.map(tag => <Chip size="large" label={tag} style={{'margin': 4}} color="primary"/>)
            )
        }
        return (
            <div></div>
        )
    }

    render() {
        return (
            <Card className={classes.root}>
                <CardContent>
                    <Divider className={classes.divider} />
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Source sentence
                        <br />
                    </Typography>

                    <Typography variant="subtitle1" gutterBottom>
                        {this.props.s0_src}
                        <br />
                    </Typography>
                    <Divider className={classes.divider} />

                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Matchine translated
                        <br />
                    </Typography>

                    <Typography variant="subtitle1" gutterBottom>
                        {this.props.s0_tgt}
                        <br />
                        <br />
                    </Typography>
                    <Divider className={classes.divider} />

                    <TextField id="standard-full-width" label="Enter translated sentence" style={{ margin: 8 }}
                        helperText="Ctrl+S to save"
                        fullWidth 
                        multiline
                        required
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    {this.addChips(this.props.tags)}
                </CardContent>

                <CardActions>
                    <Button size="small">Save</Button>
                    <Button size="small">Merge</Button>
                </CardActions>
            </Card>
        )
    }
}

export default SentenceCard;