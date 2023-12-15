import React from "react";
import { Grid, Typography, Button, Paper } from "@mui/material";
import {Routes, Route, useNavigate,Link} from 'react-router-dom';
import DatasetStyle from "../../../styles/Dataset";
import YouTube from "../../../../img/youtube.png";
import Github from "../../../../img/gitHub.png";
import Twitter from "../../../../img/twitter.png";
import YouTubeIcon from '@mui/icons-material/YouTube';

function Footer() {
  const classes = DatasetStyle();
  const navigate = useNavigate();

  const handleClickThanks = () =>{
    navigate('/thanks');

  }

  return (
    <div >
      <Grid container direction="row" >
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
            <img src={YouTube} alt="logo" style={{height:"48px"}}className={classes.footerimg} />
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
          md={2}
          lg={2}
          xl={2}
          className={classes.footerGrid}
        >
           <a href=" https://github.com/project-anuvaad/anuvaad/blob/master/LICENSE">
            <Typography variant="caption" sx={{ml:"2px"}}> License </Typography>{" "}
          </a> <span  style={{margin:"0px 15px 0px 15px"}}>|</span>
         
            <Typography variant="caption" onClick={handleClickThanks} sx={{mt:1}} className={classes.thanks} > Thanks </Typography>{" "} 
            
          
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={7}
          lg={7}
          xl={7}
          className={classes.footerGrid}
        >
          <Typography variant="caption">Powered by EkStep Foundation</Typography>
          </Grid>
        
        <Grid
          item
          xs={12}
          sm={12}
          md={3}
          lg={3}
          xl={3}
          className={classes.footerGridlast}
        >
         
          <a href="https://ai4bharat.org/">
            {" "}
            <Typography variant="caption"> AI4Bharat  </Typography>{" "}
          </a><span  style={{margin:"0px 15px 0px 15px"}}>|</span>
          <a href="https://ekstep.org/">
            {" "}
            <Typography variant="caption"> EkStep </Typography>{" "}
          </a><span  style={{margin:"0px 15px 0px 15px"}}>|</span>
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
