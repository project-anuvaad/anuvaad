import React from "react";
import { Grid, Typography, Button, Paper } from "@mui/material";
import {Routes, Route, useNavigate,Link} from 'react-router-dom';
import DatasetStyle from "../../../styles/Dataset";
import YouTube from "../../../../utils/YouTube.svg";
import Github from "../../../../utils/Github.svg";
import Twitter from "../../../../utils/Twiitter.svg";

function Footer() {
  const classes = DatasetStyle();
  const navigate = useNavigate();

  const handleClickThanks = () =>{
    navigate('/thanks');

  }

  return (
    <div>
      <Grid container direction="row">
        <Grid
          item
          xs={12}
          sm={12}
          md={7}
          lg={7}
          xl={7}
          className={classes.footerGridMains}
        >
          <a target="_blank" href="https://github.com/project-anuvaad/anuvaad">
            <img src={Github} alt="logo" className={classes.footerimg} />{" "}
          </a>
          <a target="_blank" href="https://twitter.com/hashtag/Bhashini?src=hashtag_click">
            <img src={Twitter} alt="logo" className={classes.footerimg} />
          </a>
          <a
            target="_blank"
            href="https://www.youtube.com/@projectanuvaad4271"
          >
            {" "}
            <img src={YouTube} alt="logo" className={classes.footerimg} />
          </a>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={5}
          lg={5}
          xl={5}
          className={classes.footerGridMain}
        >
          <Typography>
            Want to be a part of Anuvaad?
            <a target="_blank" href={"mailto:"+"nlp-nmt@tarento.com"} >
            <Button
              variant="contained"
              sx={{
                border: "1px solid white",
                ml: 2,
                textTransform: "capitalize",
              }}
            >
              Contact Us
            </Button>
            </a>
          </Typography>
        </Grid>
      </Grid>
      <Grid container direction="row">
        <Grid
          item
          xs={12}
          sm={12}
          md={8}
          lg={8}
          xl={8}
          className={classes.footerGrid}
        >
          
        </Grid>
        
        <Grid
          item
          xs={12}
          sm={12}
          md={4}
          lg={4}
          xl={4}
          className={classes.footerGrid}
        >
          <a href=" https://github.com/project-anuvaad/anuvaad/blob/master/LICENSE">
            <Typography variant="caption"> License </Typography>{" "}
          </a> |
         
            <Typography variant="caption" onClick={handleClickThanks} sx={{mt:1}} className={classes.thanks} > Thanks </Typography>{" "} |
            
          <a href="https://ai4bharat.org/">
            {" "}
            <Typography variant="caption"> AI4Bharat  </Typography>{" "}
          </a>|
          <a href="https://ekstep.org/">
            {" "}
            <Typography variant="caption"> EkStep </Typography>{" "}
          </a>|
          <a href="https://www.bhashini.gov.in">
            {" "}
            <Typography variant="caption"> Bhashini </Typography>{" "}
          </a>
          
         
         
        </Grid>
        
      </Grid>
    </div>
  );
}
export default Footer;
