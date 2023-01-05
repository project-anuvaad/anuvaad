// TranslatedAndVarifiedSentenceByLang

import React, { useEffect, useState } from "react";
//import themeDefault from "../../../theme/theme";
import { Grid, ThemeProvider, Box, Typography, Paper, Button } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label,
} from "recharts";
import ResponsiveChartContainer from "../common/ResponsiveChartContainer";
import ChartStyles from "../../../styles/web/ChartStyles";
import { withStyles } from "@material-ui/core/styles";
import ImageTwoTone from "@material-ui/icons/ImageTwoTone";
import PictureAsPdfOutlined from "@material-ui/icons/PictureAsPdfOutlined";


function TranslatedAndVarifiedSentenceByLang(props) {
    const { classes, onDownloadReportClick } = props;
    // const classes = ChartStyles();
    const dispatch = useDispatch();
    const sourceData = useSelector(state => state.getTranslatedAndVerifiedSetenceCount.data?.data)

    console.log(sourceData, "sourceData")

    const [totalSentences, setTotalSentences] = useState();
    const [totalVerifiedSentences, settotalVerifiedSentences] = useState();
    // const [totalReviewTasksCount, setTotalReviewTasksCount] = useState();
    const [data, setData] = useState([]);

    useEffect(() => {
        if (sourceData && sourceData.language_counts) {
            sourceData.language_counts.sort((a, b) => b.doc_sent_count - a.doc_sent_count);
        }
        setData(sourceData?.language_counts);
    }, [sourceData]);


    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={classes.toolTip} >
                    <p style={{ fontWeight: "bold" }}>{`${label}`}
                        <p style={{ fontWeight: "normal" }}  >
                            <p style={{ color: "rgba(243, 156, 18 )" }}>{`verified_sentence : ${payload[0].payload.verified_sentence
                                ? new Intl.NumberFormat("en").format(payload[0].payload.verified_sentence)
                                : 0}`}
                                <p style={{ color: "rgba(35, 155, 86 )" }}>{`Total Sentence count : ${payload[0].payload.doc_sent_count
                                    ? new Intl.NumberFormat("en").format(payload[0].payload.doc_sent_count)
                                    : 0}`}</p></p></p></p>
                </div>
            );
        }

        return null;
    };

    return (
        <>
            <Box className={classes.modelChartSection}>
                <Typography variant="h2" className={classes.heading}>
                    Sentences Dashboard
                    {/* <Typography variant="body1">
                    Count of Annotated and Reviewed Translation Sentences
                </Typography> */}
                </Typography>

                <Paper>
                    <Box className={classes.topBar}>
                        <Box className={classes.topBarInnerBox}>
                            <Typography
                                style={{
                                    fontSize: "1rem",
                                    fontWeight: "600",
                                    padding: "16px 0",
                                }}
                            >
                                Target Document Sentences
                            </Typography>
                        </Box>
                        <Box className={classes.topBarInnerBox}>
                            <Typography style={{ fontSize: "0.875rem", fontWeight: "400" }}>
                                Total Sentences
                            </Typography>
                            <Typography style={{ fontSize: "1.125rem", fontWeight: "400" }}>
                                {sourceData?.total_document_sentence_count &&
                                    new Intl.NumberFormat("en").format(sourceData?.total_document_sentence_count)}
                            </Typography>
                        </Box>
                        <Box className={classes.topBarInnerBox}>
                            <Typography style={{ fontSize: "0.875rem", fontWeight: "400" }}>
                                Total Verified Sentences
                            </Typography>
                            <Typography style={{ fontSize: "1.125rem", fontWeight: "400" }}>
                                {sourceData?.total_verified_sentence_count &&
                                    new Intl.NumberFormat("en").format(
                                        sourceData?.total_verified_sentence_count
                                    )}
                            </Typography>
                        </Box>
                        <Box className="exportButtons" displayPrint="none" style={{ flexDirection: "row", alignItems: "center", placeContent: "end", width: "25%", display: "flex" }}>
                            <Typography style={{ fontSize: "0.875rem", fontWeight: "400" }}>Download As - </Typography>
                            <Button
                                title="Download as Image"
                                onClick={() => { onDownloadReportClick(true, "img", ["translatedAndVarifiedSentenceByLang"], "Anuvaad-Analytics") }}
                                // variant="outlined"
                                color="primary"
                            >
                                <ImageTwoTone />
                                {/* Export Image */}
                            </Button>
                            <Button
                                title="Download as PDF"
                                onClick={() => { onDownloadReportClick(true, "pdf", ["translatedAndVarifiedSentenceByLang"], "Anuvaad-Analytics") }}
                                // variant="outlined"
                                color="primary"
                            >
                                {/* Export PDF */}
                                <PictureAsPdfOutlined />
                            </Button>
                        </Box>
                        {/* <Box className={classes.topBarInnerBox}>
                        <Typography style={{ fontSize: "0.875rem", fontWeight: "400" }}>
                            Total Quality/Reviewed Sentence Pairs
                        </Typography>
                        <Typography style={{ fontSize: "1.125rem", fontWeight: "400" }}>
                            {totalReviewTasksCount &&
                                new Intl.NumberFormat("en").format(totalReviewTasksCount)}
                        </Typography>
                    </Box> */}
                    </Box>
                    <Grid>
                        <ResponsiveChartContainer>
                            <BarChart
                                width={900}
                                height={500}
                                data={data}
                                fontSize="14px"
                                fontFamily="Roboto"
                                margin={{
                                    top: 20,
                                    right: 60,
                                    left: 40,
                                    bottom: 20,
                                }}
                            >
                                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                                <XAxis
                                    dataKey="tgt_label"
                                    textAnchor={"end"}
                                    // tick={<CustomizedAxisTick />}
                                    height={90}
                                    interval={0}
                                    position="insideLeft"
                                    type="category"
                                    angle={-30}
                                >
                                    <Label
                                        value="Language"
                                        position="insideBottom"
                                        fontWeight="bold"
                                        fontSize={16}
                                    ></Label>
                                </XAxis>
                                <YAxis
                                    tickInterval={10}
                                    allowDecimals={false}
                                    type="number"
                                    dx={0}
                                    tickFormatter={(value) =>
                                        new Intl.NumberFormat("en", { notation: "compact" }).format(
                                            value
                                        )
                                    }
                                >
                                    <Label
                                        value="# of Target Sentences"
                                        angle={-90}
                                        position="insideLeft"
                                        fontWeight="bold"
                                        fontSize={16}
                                        offset={-15}
                                    ></Label>
                                </YAxis>
                                {/* <Label value="Count" position="insideLeft" offset={15} /> */}
                                <Tooltip
                                    contentStyle={{ fontFamily: "Roboto", fontSize: "14px" }}
                                    formatter={(value) =>
                                        new Intl.NumberFormat("en").format(value)
                                    }
                                    cursor={{ fill: "none" }}
                                    content={<CustomTooltip />}
                                />
                                <Legend verticalAlign="top" />
                                <Bar
                                    dataKey="doc_sent_count"
                                    barSize={30}
                                    name="Total Sentences"
                                    stackId="a"
                                    fill="rgba(35, 155, 86 )"
                                    cursor="pointer"
                                />
                                <Bar
                                    dataKey="verified_sentence"
                                    barSize={30}
                                    name="Verified Sentences"
                                    stackId="a"
                                    fill="rgba(243, 156, 18 )"
                                />
                            </BarChart>
                        </ResponsiveChartContainer>
                    </Grid>
                </Paper>
            </Box>
        </>
    );
}
export default withStyles(ChartStyles)(TranslatedAndVarifiedSentenceByLang);
