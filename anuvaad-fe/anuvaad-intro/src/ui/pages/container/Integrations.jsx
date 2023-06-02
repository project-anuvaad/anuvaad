import React from "react";
import { Grid, Typography, Button, Paper, Tooltip } from "@mui/material";
import DatasetStyle from "../../styles/Dataset";
import Anuvaanlogo from "../../../img/Anuvaanlogo.png";
import LightTooltip from "../component/common/Tooltip";
import { ThemeProvider } from "@mui/material";
import themeDefault from "../theme/theme";

export default function Integrations() {
  const classes = DatasetStyle();

  return (
    <ThemeProvider theme={themeDefault}>
      <div>
        <Grid sx={{ mt: 10, mb: 10 }}>
          <Typography
            variant="h4"
            className={classes.titles}
          >
            Integrations
          </Typography>

          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{
              mt: 4,
              mb: 15,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <Tooltip
                arrow
                title="The artificial intelligence committee and the Ministry of Law and Justice leverage an instance of Anuvaad called Supreme Court Vidhik Anuvaad Software (SUVAS) to translate legal papers from English into vernacular languages and vice versa. Currently supports all the 22 Indian official languages"
                placement="bottom-start"
              >
                <Button sx={{ textTransform: "capitalize" }}>
                  <Paper component="form" className={classes.integrationPaper}>
                    <img
                      src={Anuvaanlogo}
                      alt="logo"
                      className={classes.Anuvaanlogo}
                    />
                    Supreme Court of India
                  </Paper>
                </Button>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <Tooltip
                arrow
                title="The Bangladesh Supreme Court leverage an instance of Anuvaad called 'Amar Vasha' to translate orders and judgements of the Supreme Court from English to Bangla"
                placement="bottom-start"
              >
                <Button sx={{ textTransform: "capitalize" }}>
                  <Paper component="form" className={classes.integrationPaper}>
                    <img
                      src={Anuvaanlogo}
                      alt="logo"
                      className={classes.Anuvaanlogo}
                    />
                    Supreme Court of Bangladesh
                  </Paper>
                </Button>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <Tooltip
                arrow
                title="The Diksha platform offers teachers, students and parents engaging learning material relevant to the prescribed school curriculum. They leverage Anuvaad for making the educational content available in all the official languages"
                placement="bottom-start"
              >
                <Button sx={{ textTransform: "capitalize" }}>
                  <Paper component="form" className={classes.integrationPaper}>
                    <img
                      src={Anuvaanlogo}
                      alt="logo"
                      className={classes.Anuvaanlogo}
                    />
                    Diksha
                  </Paper>
                </Button>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <Tooltip
                arrow
                title="The Bhashini is a National Language Translation Mission initiative from Ministry of Information Technology. They leverage Anuvaad for enabling the document translation services for various Integrators."
                placement="bottom-start"
              >
                <Button sx={{ textTransform: "capitalize" }}>
                  <Paper component="form" className={classes.integrationPaper}>
                    <img
                      src={Anuvaanlogo}
                      alt="logo"
                      className={classes.Anuvaanlogo}
                    />
                    Bhashini
                  </Paper>
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}
