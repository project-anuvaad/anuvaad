import React, { useEffect } from "react";
import { Grid, Typography, Button, Link, Paper, Box } from "@mui/material";
import Integrations from "../container/Integrations";
import Features from "../container/Features";
import Principles from "../container/Principles";
import Footer from "./common/Footer";
import Header from "./common/Header";
import DatasetStyle from "../../styles/Dataset";
import Anuvaanlogo from "../../../img/AnuvaadImg.png";

function AnuvaadPortal() {
  const classes = DatasetStyle();

  const handleWatchDemoVideo = () => {
    const url = "https://www.youtube.com/watch?v=aerZyHnGUb4";
    window.open(url, "_blank");
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div>
      <Header />
      <Grid container direction="row" className={classes.section}>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ mt: 20, mb: 20 }}>
          <Typography variant="h2" className={classes.Anuvaadtitle}>
            Anuvaad
          </Typography>
          <Typography
            sx={{
              fontSize: "1.25rem",
              lineHeight: "2rem",
              margin: "0 35px 25px 45px",
              textAlign: "justify",
            }}
          >
            <b>Anuvaad</b> is an AI based open source
            <b> Document Translation Platform </b> to translate documents in
            Indic languages at scale. Anuvaad provides easy-to-edit capabilities
            on top the plug & play NMT models. Separate instances of Anuvaad are
            deployed to{" "}
            <a
              className={classes.homeLink}
              href="https://diksha.anuvaad.org/"
              target="blank"
            >
              <b>Diksha</b>
            </a>{" "}
            (NCERT),{" "}
            <a
              className={classes.homeLink}
              href="https://jud.anuvaad.org/"
              target="blank"
            >
              <b>Supreme Court of India</b>{" "}
            </a>{" "}
            (SUVAS) and{" "}
            <b className={classes.homeLink}>Supreme Court of Bangladesh</b>{" "}
            (Amar Vasha).
          </Typography>

          <Button
            variant="contained"
            className={classes.buttons}
            onClick={handleWatchDemoVideo}
          >
            Watch Demo Video
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={5} lg={5} xl={5} sx={{ mt: 2 }}>
          <Box display={{ xs: "none", md: "inherit" }}>
            <img src={Anuvaanlogo} className="aboutImg" />
          </Box>
        </Grid>
      </Grid>

      <Principles />
      <Features />
      <Integrations />
      <Footer />
    </div>
  );
}
export default AnuvaadPortal;
