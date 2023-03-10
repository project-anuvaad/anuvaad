import { Box, Typography } from '@material-ui/core';
import React from 'react';

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
            <Box
                style={{
                    background: "url('img/slide1-bg.jpg')",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    padding: "0 5%",
                    display: "flex",
                    alignItems: "center",
                }}
                marginTop={{ xs: 2, md: 0 }}
            >
                <Box style={{ width: "100%", }}>
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
                        {/* <CustomButtonGroup buttonGroup={buttonGroupConfig} /> */}
                    </Box>
                </Box>
                <Box display={{ xs: 'none', md: 'inherit' }}>
                    <img src={"img/anuvaad-bg.png"} style={{ width: "85%" }} />
                </Box>
            </Box>
        </>
    )
}

export default Intro