import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, Icon, IconButton, Tooltip, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import TranslateIcon from '@material-ui/icons/Translate';
import DescriptionIcon from '@material-ui/icons/Description';
import SubjectIcon from '@material-ui/icons/Subject';
import { Link, withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import history from "../../../../web.history";
import LoginStyles from "../../../styles/web/IntroPage";

// const description = (
//     <>
//         <b>Anuvaad</b> is an AI based open source{" "}
//         <b>Document Translation Platform</b> to translate documents in Indic
//         languages at scale. Anuvaad provides easy-to-edit capabilities on top the
//         plug & play NMT models. Separate instances of Anuvaad are deployed to{" "}
//         <a
//             style={{
//                 color: "#000",
//                 textDecoration: "underline",
//             }}
//             // className={classes.homeLink}
//             href="https://diksha.anuvaad.org/"
//             target="blank"
//         >
//             <b>Diksha</b>
//         </a>{" "}
//         (NCERT),{" "}
//         <a
//             style={{
//                 color: "#000",
//                 textDecoration: "underline",
//             }}
//             // className={classes.homeLink}
//             href="https://jud.anuvaad.org/"
//             target="blank"
//         >
//             <b>Supreme Court of India</b>{" "}
//         </a>{" "}
//         (SUVAS) and{" "}
//         <b
//             style={{
//                 color: "#000",
//                 textDecoration: "underline",
//             }}
//         //   className={classes.homeLink}
//         >Supreme Court of Bangladesh</b> (Amar
//         Vasha).
//     </>
// );

const Intro = (props) => {
    const { classes } = props;

    const [open, setOpen] = useState(true);
    const [agreed, setAgreed] = useState(false);


    const handleClose = () => {
        setOpen(false);
    };

    const handleCheckboxChange = (event) => {
        setAgreed(event.target.checked);
    };

    return (
        <>
            {/*  */}

            <Grid className={classes.container}>
                <Box
                    className={classes.backgroundContainerBox}
                    marginTop={{ xs: 2, md: 0 }}
                >
                    <Tooltip
                        title='Digitize Document'
                    >
                        <Link to="/digitize-document-upload" className={classes.linkStyle}>
                            <div
                                className={classes.introPageLinkCard}
                            >
                                <DescriptionIcon fontSize='large' style={{ fontSize: "10rem" }} htmlColor='rgb(44, 39, 153)' />
                                <div><Typography variant='h5'>Digitize Document</Typography></div>
                                <Typography variant='caption'>Digitize Document helps to convert scanned documents into digital format. This process recognizes text in scanned (non hand-written) documents and converts it into searchable text.</Typography>
                            </div>
                        </Link>

                    </Tooltip>
                    <Tooltip
                        title='Translate Document'
                    >
                        <Link to="/document-upload" className={classes.linkStyle}>
                            <div
                                className={classes.introPageLinkCard}                        >
                                <TranslateIcon fontSize='large' style={{ fontSize: "10rem" }} htmlColor='rgb(44, 39, 153)' />
                                <div><Typography variant='h5'>Translate Document</Typography></div>
                                <Typography variant='caption'>Translate Document helps to convert documents from one language to another. Currently, English-Indic and Indic-English translations are supported.</Typography>
                            </div>
                        </Link>

                    </Tooltip>
                    <Tooltip
                        title='Translate Sentence'
                    >
                        <Link to="/instant-translate" className={classes.linkStyle}>
                            <div
                                className={classes.introPageLinkCard}
                            >
                                <SubjectIcon fontSize='large' style={{ fontSize: "10rem" }} htmlColor='rgb(44, 39, 153)' />
                                <div><Typography variant='h5'>Translate Sentence</Typography></div>
                                <Typography variant='caption'>Translate Sentence helps to convert sentences from one language to another.</Typography>
                            </div>
                        </Link>

                    </Tooltip>
                </Box>
                {/* <Typography variant='body2'>Pro tip: If the document to be translated does not contain unicode fonts, please perform document digitization and then translate the digitized document.</Typography> */}
                <div
                    className={classes.footerContainer}
                >
                    <Typography variant='caption'> For best performance, use Chrome Version 88 or above.</Typography>
                    <Typography variant='body2'>Pro tip: If the document to be translated does not contain unicode fonts, please perform document digitization and then translate the digitized document.</Typography>
                </div></Grid>

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
            <Dialog open={open} maxWidth={"lg"} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <DialogTitle style={{textAlign:"center"}}>Terms & Conditions</DialogTitle>
                <DialogContent dividers style={{padding: "30px", textAlign: "justify"}}>
                    <Typography variant="body1" style={{ marginBottom: "40px", fontSize: "1rem" }}>
                        By accessing and using Anuvaad platform, you agree to the following terms and conditions:
                    </Typography>
                    <Typography variant="body1" style={{ marginBottom: "15px", fontSize: "1rem" }}>
                        <strong>Personal Use Only:</strong> This platform is intended solely for individual use to experience its features. Commercial use or use on behalf of any organization is strictly prohibited.
                    </Typography>
                    <Typography variant="body1" style={{ marginBottom: "15px", fontSize: "1rem" }}>
                        <strong>Fair Usage:</strong> Experience the platform only with documents {"<="} 100 pages and do not submit multiple documents in parallel.
                    </Typography>
                    <Typography variant="body1" style={{ marginBottom: "15px", fontSize: "1rem" }}>
                        <strong>User Conduct:</strong> You agree to use the platform responsibly and not engage in any activity that could harm, disrupt, or interfere with the platform's functionality or other user's experience.
                    </Typography>
                    <Typography variant="body1" style={{ marginBottom: "15px", fontSize: "1rem" }}>
                        <strong>Privacy and Data Collection:</strong> By using this platform, you consent to the collection and use of your personal information as outlined in our Privacy Policy.
                    </Typography>
                    <Typography variant="body1" style={{ marginBottom: "15px", fontSize: "1rem" }}>
                        <strong>Limitation of Liability:</strong> The platform owner is not liable for any damages arising from your use of the platform, including but not limited to direct, indirect, incidental, punitive, and consequential damages.
                    </Typography>
                    <Typography variant="body1" style={{ marginBottom: "40px", fontSize: "1rem" }}>
                        <strong>Termination:</strong> The platform owner reserves the right to terminate or restrict your access to the platform at any time, without notice, for any reason.
                    </Typography>
                    <FormControlLabel
                        control={<Checkbox checked={agreed} color='primary' onChange={handleCheckboxChange} />}
                        label={<Typography style={{fontSize: "16px"}}>By using the platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.</Typography>}
                    />
                    <Grid style={{textAlign:"center", marginTop:"2rem"}}>
                        <Button onClick={handleClose} color="primary" size='large' variant='contained' disabled={!agreed}>
                        Continue
                    </Button>
                    </Grid>
                    
                </DialogContent>
            </Dialog>
        </>
    )
}

// export default Intro
export default withStyles(LoginStyles)(Intro);
