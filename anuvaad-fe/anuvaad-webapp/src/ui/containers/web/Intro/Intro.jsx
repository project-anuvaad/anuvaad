import { Box, Button, Grid, Icon, IconButton, Tooltip, Typography } from '@material-ui/core';
import React from 'react';
import TranslateIcon from '@material-ui/icons/Translate';
import DescriptionIcon from '@material-ui/icons/Description';
import SubjectIcon from '@material-ui/icons/Subject';
import history from "../../../../web.history";

const description = (
    <>
        <b>Anuvaad</b> is an AI based open source{" "}
        <b>Document Translation Platform</b> to translate documents in Indic
        languages at scale. Anuvaad provides easy-to-edit capabilities on top the
        plug & play NMT models. Separate instances of Anuvaad are deployed to{" "}
        <a
            style={{
                color: "#000",
                textDecoration: "underline",
            }}
            // className={classes.homeLink}
            href="https://diksha.anuvaad.org/"
            target="blank"
        >
            <b>Diksha</b>
        </a>{" "}
        (NCERT),{" "}
        <a
            style={{
                color: "#000",
                textDecoration: "underline",
            }}
            // className={classes.homeLink}
            href="https://jud.anuvaad.org/"
            target="blank"
        >
            <b>Supreme Court of India</b>{" "}
        </a>{" "}
        (SUVAS) and{" "}
        <b
            style={{
                color: "#000",
                textDecoration: "underline",
            }}
        //   className={classes.homeLink}
        >Supreme Court of Bangladesh</b> (Amar
        Vasha).
    </>
);

const Intro = () => {
    return (
        <>
            {/*  */}

            <Grid
                style={{
                    // flexDirection: "row",
                    alignItems: "center",
                    // justifyContent: "space-around",
                    // display: "flex",
                    marginTop: 40,
                    width: "100%",
                    textAlign: "center",
                    // height: "90%"
                }}
            ><Box
                style={{
                    background: "url('img/slide1-bg.jpg')",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    padding: "5% 5%",
                    display: "flex",
                    // alignItems: "center",
                    justifyContent: "space-around",
                    flexWrap: "wrap",
                    rowGap: "20px",
                    height: "110%"
                }}
                marginTop={{ xs: 2, md: 0 }}
            >
                    <Tooltip
                        title='Digitize Document'
                    >
                        <div
                            onClick={() => history.push(`${process.env.PUBLIC_URL}/digitize-document-upload`)}
                            style={{ cursor: "pointer", width: "40%", border: "0.5px solid rgba(0,0,0,0.4)", padding: 5, maxHeight: "270px", borderRadius: 10 }}
                        >
                            <DescriptionIcon fontSize='large' style={{ fontSize: "10rem" }} htmlColor='rgb(44, 39, 153)' />
                            <div><Typography variant='subtitle1'>Digitize Document</Typography></div>
                            <Typography variant='caption'>Digitize Document helps to convert scanned documents into digital format. This process recognizes text in scanned (non hand-written) documents and converts it into searchable text.</Typography>
                        </div>
                    </Tooltip>
                    <Tooltip
                        title='Translate Document'
                    >
                        <div
                            onClick={() => history.push(`${process.env.PUBLIC_URL}/document-upload`)}
                            style={{ cursor: "pointer", width: "40%", border: "0.5px solid rgba(0,0,0,0.4)", padding: 5, maxHeight: "270px", borderRadius: 10 }}
                        >
                            <TranslateIcon fontSize='large' style={{ fontSize: "10rem" }} htmlColor='orange' />
                            <div><Typography variant='subtitle1'>Translate Document</Typography></div>
                            <Typography variant='caption'>Translate Document helps to convert documents from one language to another. Currently, English-Indic and Indic-English translations are supported.</Typography>
                        </div>
                    </Tooltip>
                    <Tooltip
                        title='Translate Sentence'
                    >
                        <div
                            onClick={() => history.push(`${process.env.PUBLIC_URL}/instant-translate`)}
                            style={{ cursor: "pointer", width: "40%", border: "0.5px solid rgba(0,0,0,0.4)", padding: 5, maxHeight: "270px", borderRadius: 10 }}
                        >
                            <SubjectIcon fontSize='large' style={{ fontSize: "10rem" }} htmlColor='rgb(44, 39, 153)'  />
                            <div><Typography variant='subtitle1'>Translate Sentence</Typography></div>
                            <Typography variant='caption'>Translate Sentence helps to convert sentences from one language to another.</Typography>
                        </div>
                    </Tooltip>
                    </Box>
                <Typography variant='body2'>Pro tip: If the document to be translated does not contain unicode fonts, please perform document digitization and then translate the digitized document.</Typography>
            </Grid>
            <p
                direction="left"
                width="100%"
                bgcolor="white"
                style={{
                    color: "rgb(44, 39, 153)",
                    position: "absolute",
                    bottom: 5,
                    right: 10
                }}
            >For best performance, use Chrome Version 88 or above.</p>
            {/*<Box style={{ width: "100%", }}>
                    <Typography variant="h1" style={{
                        color: "#3a3a3a",
                        margin: "24px 0",
                    }}>
                        Anuvaad
                    </Typography>
                    <Typography style={{
                        fontSize: "1.25rem",
                        lineHeight: "2rem",
                        margin: "0 35px 25px 0",
                        textAlign: "justify",
                    }}>{description}</Typography>
                    <Box>
                    </Box>
                </Box>
                <Box display={{ xs: 'none', md: 'inherit' }}>
                    <img src={"img/anuvaad-bg.png"} style={{ width: "85%" }} />
                </Box>*/}
            {/* </Box>  */}

        </>
    )
}

export default Intro