// DocumentCountByLang

import { Box, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Typography, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    XAxis,
    LabelList,
    YAxis,
    Tooltip,
    Label,
} from "recharts";
import ChartStyles from "../../../styles/web/ChartStyles";
import ResponsiveChartContainer from "../common/ResponsiveChartContainer";
import { withStyles } from "@material-ui/core/styles";
import ArrowDownwardOutlined from "@material-ui/icons/ArrowDownwardOutlined";
import ImageTwoTone from "@material-ui/icons/ImageTwoTone";
import PictureAsPdfOutlined from "@material-ui/icons/PictureAsPdfOutlined";
const LANG_MODEL = require('../../../../utils/language.model')

const colors = [
    "188efc",
    "7a47a4",
    "b93e94",
    "1fc6a4",
    "f46154",
    "d088fd",
    "f3447d",
    "188efc",
    "f48734",
    "189ac9",
    "0e67bd",
];

const DocumentCountByLang = (props) => {
    // const classes = ChartStyles();

    const { incomingData, loadingChart, classes, onDownloadReportClick } = props;
    const [selectedSourceLang, setSelectedSourceLang] = useState('en');
    const [sourceData, setSourceData] = useState();
    const [axisValue, setAxisValue] = useState({
        yAxis: "Count",
        xAxis: "Language",
    });

    const handleSrcLangChange = (event) => {
        setSelectedSourceLang(event.target.value);
        props.onLanguageChange(event.target.value);
    }

    const allLanguages = useSelector((state) => state.getAnuvaadSupportedLanguages);

    useEffect(() => {
        // console.log("incomingData --- ", incomingData?.language_counts);
        // console.log("incomingData1 --- ", incomingData?.language_counts?.total_doc);
        if (incomingData && Array.isArray(incomingData?.language_counts)) {
            incomingData.language_counts.sort((a, b) => b.total_doc - a.total_doc)
            setSourceData(incomingData);
        } else {
            setSourceData([]);
        }

    }, [incomingData])

    const CustomizedAxisTick = (props) => {
        const { x, y, payload } = props;

        return (
            <g transform={`translate(${x},${y})`}>
                <text
                    x={0}
                    y={0}
                    dy={16}
                    textAnchor="end"
                    fill="#666"
                    transform="rotate(-35)"
                >
                    {payload.value &&
                        payload.value.substr(0, 14) +
                        (payload.value.length > 14 ? "..." : "")}
                </text>
            </g>
        );
    };

    return (
        <Box className={classes.modelChartSection}>
            <Typography variant="h2" className={classes.heading}>
                Documents Dashboard
            </Typography>
            <Paper>
                <Box className={classes.topBar}>
                    <Box className={classes.topBarInnerBox}>
                        <Typography
                            style={{ fontSize: "1rem", fontWeight: "600", padding: "16px 0" }}
                        >
                            Documents
                        </Typography>
                    </Box>
                    <Box className={classes.topBarInnerBox}>
                        <Typography style={{ fontSize: "0.875rem", fontWeight: "400" }}>
                            Total Count
                        </Typography>
                        <Typography style={{ fontSize: "1.125rem", fontWeight: "400" }}>
                            {sourceData?.total_documents
                                ? new Intl.NumberFormat("en").format(sourceData?.total_documents)
                                : 0}
                        </Typography>
                    </Box>
                    <Box className="exportButtons" displayPrint="none" style={{ flexDirection: "row", alignItems: "center", placeContent: "end", width: "50%", display: "flex" }}>
                    <Typography style={{ fontSize: "0.875rem", fontWeight: "400" }}>Download As - </Typography>
                        <Button
                            title="Export as Image"
                            onClick={() => { onDownloadReportClick(true, "img", ["documentCountByLang"], "Anuvaad-Analytics") }}
                            color="primary"
                        >
                            {/* Export Image */}
                            <ImageTwoTone />
                        </Button>
                        <Button
                            title="Export as PDF"
                            onClick={() => { onDownloadReportClick(true, "pdf", ["documentCountByLang"], "Anuvaad-Analytics") }}
                            color="primary"
                        >
                            {/* Export PDF */}
                            <PictureAsPdfOutlined />
                        </Button>
                    </Box>
                </Box>
                <Grid
                    container
                    direction="row"
                    alignItems={'center'}
                    style={{ textAlign: 'left', margin: "40px" }}
                >
                    <Typography variant='h6'>
                        Number of Documents processed per language with
                    </Typography>
                    <Box style={{ marginLeft: 40 }}>
                        <FormControl variant="standard" style={{ m: 1, minWidth: 200 }}>
                            <InputLabel id="demo-simple-select-helper-label">Source Language</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={selectedSourceLang}
                                label="Source Language"
                                onChange={handleSrcLangChange}
                                style={{
                                    textAlign: "left",
                                    border: '0px solid transparent',
                                }}
                            >
                                {allLanguages && allLanguages.length > 0 && allLanguages.map((el, i) => {
                                    return <MenuItem value={el.code}>{el.label}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </Box>
                    {/* <Typography style={{ fontSize: "1.125rem", fontWeight: "400" }}>
                {getCommaSaparatedNumber(sourceData?.totalCount)}
              </Typography> */}
                </Grid>
                <Box style={{ margin: "20px" }}>
                    {!loadingChart ? (
                        <ResponsiveChartContainer>
                            <BarChart
                                width={900}
                                height={400}
                                data={sourceData?.language_counts}
                                fontSize="14px"
                                fontFamily="Roboto"
                                maxBarSize={100}
                            >
                                <XAxis
                                    dataKey="tgt_label"
                                    textAnchor={"end"}
                                    tick={<CustomizedAxisTick />}
                                    height={130}
                                    interval={0}
                                    position="insideLeft"
                                    type="category"
                                >
                                    <Label
                                        value={axisValue.xAxis}
                                        position="insideBottom"
                                        fontWeight="bold"
                                        fontSize={16}
                                    ></Label>
                                </XAxis>
                                <YAxis
                                    padding={{ top: 80 }}
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
                                        value={axisValue.yAxis}
                                        angle={-90}
                                        position="insideLeft"
                                        fontWeight="bold"
                                        fontSize={16}
                                    ></Label>
                                </YAxis>

                                <Tooltip
                                    contentStyle={{ fontFamily: "Roboto", fontSize: "14px" }}
                                    formatter={(value) =>
                                        new Intl.NumberFormat("en").format(value)
                                    }
                                    cursor={{ fill: "none" }}
                                />
                                <Bar
                                    margin={{ top: 140, left: 20, right: 20, bottom: 20 }}
                                    dataKey="total_doc"
                                    cursor="pointer"
                                    radius={[8, 8, 0, 0]}
                                    maxBarSize={65}
                                    //   onClick={(event) => handleOnClick(page + 1, event)}
                                    isAnimationActive={false}
                                >
                                    <LabelList
                                        formatter={(value) =>
                                            new Intl.NumberFormat("en").format(value)
                                        }
                                        cursor={{ fill: "none" }}
                                        position="top"
                                        dataKey="value"
                                        fill="black"
                                        style={{ textAnchor: "start" }}
                                        angle={-30}
                                        clockWise={4}
                                    />
                                    {sourceData?.language_counts?.length > 0 &&
                                        sourceData?.language_counts?.map((entry, index) => {
                                            const color = colors[index < 9 ? index : index % 10];
                                            return <Cell key={index} fill={`#${color}`} />;
                                        })}
                                </Bar>
                            </BarChart>
                        </ResponsiveChartContainer>
                    ) : (
                        <Box display="flex" justifyContent="center">
                            <CircularProgress
                                color="primary"
                                size={50}
                                style={{ margin: "20%" }}
                            />
                        </Box>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default withStyles(ChartStyles)(DocumentCountByLang);
