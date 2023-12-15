// GetUploadedDocumentCount

import React, { useEffect, useState } from "react";
//import themeDefault from "../../../theme/theme";
import { Grid, ThemeProvider, Box, Typography, Paper, Button, Popover, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
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
import GetAppIcon from '@material-ui/icons/GetApp';


function GetUploadedDocumentCount(props) {
    const { classes, onDownloadReportClick } = props;
    // const classes = ChartStyles();
    const dispatch = useDispatch();

    const assignedUserOrg = JSON.parse(localStorage.getItem("userProfile"))?.orgID

    const sourceData = useSelector(state => state.getUploadedDocumentCount.data?.data);
    const allLanguages = useSelector((state) => state.getAnuvaadSupportedLanguages);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const showExportPopover = Boolean(anchorEl);

    // console.log(sourceData, "sourceData")

    const [totalSentences, setTotalSentences] = useState();
    const [totalVerifiedSentences, settotalVerifiedSentences] = useState();
    // const [totalReviewTasksCount, setTotalReviewTasksCount] = useState();
    const [data, setData] = useState([]);

    const [orgIdsDataArr, setOrgIdsDataArr] = useState(null);
    const [selectedOrgId, setSelectedOrgId] = useState(assignedUserOrg ? assignedUserOrg : "ALL");
    const [selectedSourceLang, setSelectedSourceLang] = useState("English");

    // Total document count 
    const [totalDocumentcount, setTotalDocumentcount] = useState(0);
    const [totalInprogressDocumentcount, setTotalInprogressDocumentcount] = useState(0);
    const [totalUploadedDocumentcount, setTotalUploadedDocumentcount] = useState(0);

    useEffect(() => {
        if (sourceData && sourceData.data) {
            sourceData.data.sort((a, b) => b.org - a.org);
        }
        // setData(sourceData?.data);
        console.log("sourceData ---- ", sourceData);

        let orgIds = ["ALL", ...new Set(sourceData?.data.map(el => el.org))];
        // console.log("orgIds ... ", orgIds);
        setOrgIdsDataArr(orgIds);

        onOrgChange(selectedOrgId, selectedSourceLang);

    }, [sourceData]);

    useEffect(() => {
        onOrgChange(selectedOrgId, selectedSourceLang);
    }, [selectedOrgId, selectedSourceLang])

    const onOrgChange = (orgId = selectedOrgId, srcLang = selectedSourceLang) => {
        if (sourceData) {
            let filteredDataByOrgAndSrcLang = sourceData?.data.filter(el => {
                if (orgId === "ALL") {
                    return el.src === selectedSourceLang
                } else {
                    return el.org === orgId && el.src === selectedSourceLang
                }
            });

            // format chart data when showing all organizations data combining based on source and target language
            const allTgtLangsInFilteredData = [...new Set(filteredDataByOrgAndSrcLang?.map(el => el.tgt))];

            if (orgId === "ALL") {
                const allOrgData = [];
                allTgtLangsInFilteredData.map(lang => {
                    let sameTgtLangArr = [];
                    filteredDataByOrgAndSrcLang.map((dataObj) => {
                        if (dataObj.tgt === lang) {
                            sameTgtLangArr.push(dataObj);
                        }
                    })
                    console.log(sameTgtLangArr);

                    allOrgData.push(sameTgtLangArr.reduce((a, b) => {
                        return {
                            in_progress: a.in_progress + b.in_progress,
                            src: a.src,
                            tgt: a.tgt,
                            uploaded: a.uploaded + b.uploaded
                        }
                    }))
                })

                filteredDataByOrgAndSrcLang = allOrgData;

            }

            let totalInprogressDocuments = 0;
            let totalUploadedDocuments = 0;

            filteredDataByOrgAndSrcLang && filteredDataByOrgAndSrcLang.length > 0 && filteredDataByOrgAndSrcLang.map((el) => {
                totalInprogressDocuments = totalInprogressDocuments + el.in_progress;
                totalUploadedDocuments = totalUploadedDocuments + el.uploaded;
            })

            const totalDocuments = totalInprogressDocuments + totalUploadedDocuments;

            setTotalDocumentcount(totalDocuments);
            setTotalInprogressDocumentcount(totalInprogressDocuments);
            setTotalUploadedDocumentcount(totalUploadedDocuments)

            const formattedDataForMetrics = filteredDataByOrgAndSrcLang;

            formattedDataForMetrics && formattedDataForMetrics.length > 0 && formattedDataForMetrics.sort((a, b) => (a.in_progress + a.uploaded) > (b.in_progress + b.uploaded) ? -1 : 1);

            setData(formattedDataForMetrics);
        }

    }


    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            // console.log("payload --- ", payload);
            return (
                <div className={classes.toolTip} >
                    <p style={{ fontWeight: "bold" }}>{`${label}`}
                        <p style={{ fontWeight: "normal" }}  >
                            <p style={{ color: "rgba(243, 156, 18 )" }}>{`Document Uploaded : ${payload[0].payload.uploaded
                                ? new Intl.NumberFormat("en").format(payload[0].payload.uploaded)
                                : 0}`}
                                <p style={{ color: "rgba(35, 155, 86 )" }}>{`Document Inprogress : ${payload[0].payload.in_progress
                                    ? new Intl.NumberFormat("en").format(payload[0].payload.in_progress)
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
                    Reviewer Dashboard
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
                                Documents
                            </Typography>
                        </Box>
                        <Box className={classes.topBarInnerBox}>
                            <Typography style={{ fontSize: "0.875rem", fontWeight: "400" }}>
                                Total Documents
                            </Typography>
                            <Typography style={{ fontSize: "1.125rem", fontWeight: "400" }}>
                                {totalDocumentcount &&
                                    new Intl.NumberFormat("en").format(totalDocumentcount)}
                            </Typography>
                        </Box>
                        <Box className={classes.topBarInnerBox}>
                            <Typography style={{ fontSize: "0.875rem", fontWeight: "400" }}>
                                Documents In Progress
                            </Typography>
                            <Typography style={{ fontSize: "1.125rem", fontWeight: "400" }}>
                                {totalInprogressDocumentcount &&
                                    new Intl.NumberFormat("en").format(totalInprogressDocumentcount)}
                            </Typography>
                        </Box>
                        <Box className={classes.topBarInnerBox}>
                            <Typography style={{ fontSize: "0.875rem", fontWeight: "400" }}>
                                Documents Completed
                            </Typography>
                            <Typography style={{ fontSize: "1.125rem", fontWeight: "400" }}>
                                {totalUploadedDocumentcount &&
                                    new Intl.NumberFormat("en").format(totalUploadedDocumentcount)}
                            </Typography>
                        </Box>
                        <Box className="exportButtons" displayPrint="none" style={{ flexDirection: "row", alignItems: "center", placeContent: "end", width: "25%", display: "flex" }}>
                            <Button
                                onClick={(e) => setAnchorEl(e.currentTarget)}
                            >
                                <GetAppIcon />
                            </Button>
                            <Popover
                                id={"simple-popover"}
                                open={showExportPopover}
                                anchorEl={anchorEl}
                                onClose={() => setAnchorEl(null)}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                <Grid
                                    container
                                    direction="column"
                                    style={{ overflow: "hidden", padding: 10 }}
                                >
                                    <Button
                                        fullWidth
                                        onClick={() => {
                                            setAnchorEl(null)
                                            onDownloadReportClick(true, "img", ["getUploadedDocumentCount"], "Anuvaad-Analytics")
                                        }}
                                    >
                                        <Grid style={{ display: "flex", width: "100%", justifyContent: "flex-start", alignItems: "center" }}>
                                            <Typography variant="button">Image</Typography>
                                        </Grid>
                                    </Button>
                                    <Button
                                        fullWidth
                                        onClick={() => {
                                            setAnchorEl(null)
                                            onDownloadReportClick(true, "pdf", ["getUploadedDocumentCount"], "Anuvaad-Analytics")
                                        }}
                                    >
                                        <Grid style={{ display: "flex", width: "100%", justifyContent: "flex-start", alignItems: "center" }}>
                                            <Typography variant="button">PDF</Typography>
                                        </Grid>
                                    </Button>
                                </Grid>
                            </Popover>

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
                    <Grid
                        container
                        direction="row"
                        alignItems={'center'}
                        style={{ textAlign: 'left', margin: "40px" }}
                    >
                        <Typography variant='h6'>
                            {/* Number of Documents processed per organization and language with  */}
                            Document count per organization classified by languages
                        </Typography>
                        <Box style={{ marginLeft: 10 }}>
                            <FormControl variant="standard" style={{ m: 1, minWidth: 200 }}>
                                <InputLabel id="demo-simple-select-helper-label">Organization</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={selectedOrgId}
                                    label="Organization"
                                    onChange={(event) => setSelectedOrgId(event.target.value)}
                                    style={{
                                        textAlign: "left",
                                        border: '0px solid transparent',
                                    }}
                                >
                                    {orgIdsDataArr && orgIdsDataArr.length > 0 && orgIdsDataArr.map((el, i) => {
                                        return <MenuItem value={el}>{el}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Box>
                        <br />
                        {/* <Typography variant='h6' style={{marginLeft: 20}}>
                        and language
                    </Typography> */}
                        <Box style={{ marginLeft: 10 }}>
                            <FormControl variant="standard" style={{ m: 1, minWidth: 200 }}>
                                <InputLabel id="demo-simple-select-helper-label">Source Language</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={selectedSourceLang}
                                    label="Source Language"
                                    onChange={(event) => setSelectedSourceLang(event.target.value)}
                                    style={{
                                        textAlign: "left",
                                        border: '0px solid transparent',
                                    }}
                                >
                                    {allLanguages && allLanguages.length > 0 && allLanguages.map((el, i) => {
                                        return <MenuItem value={el.label}>{el.label}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Box>
                        {/* <Typography style={{ fontSize: "1.125rem", fontWeight: "400" }}>
                {getCommaSaparatedNumber(sourceData?.totalCount)}
              </Typography> */}
                    </Grid>
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
                                <XAxis
                                    dataKey="tgt"
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
                                        value="# of Documents"
                                        angle={-90}
                                        position="insideLeft"
                                        fontWeight="bold"
                                        fontSize={16}
                                        offset={-15}
                                    ></Label>
                                </YAxis>
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
                                    dataKey="in_progress"
                                    barSize={30}
                                    name="Documents In Progress"
                                    stackId="a"
                                    fill="rgba(35, 155, 86 )"
                                    cursor="pointer"
                                />
                                <Bar
                                    dataKey="uploaded"
                                    barSize={30}
                                    name="Documents Uploaded"
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
export default withStyles(ChartStyles)(GetUploadedDocumentCount);
