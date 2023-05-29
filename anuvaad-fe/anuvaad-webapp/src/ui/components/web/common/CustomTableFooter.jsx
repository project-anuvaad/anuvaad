import React from "react";
import { Button, IconButton, TableCell, TableFooter, TableRow, TextField, Typography } from "@material-ui/core";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

export const CustomTableFooter = (props) => {
    const {
        renderCondition,
        countLabel,
        totalCount,
        pageInputRef,
        inputValue,
        onInputFocus,
        onInputBlur,
        handleInputChange,
        totalPageCount,
        onGoToPageClick,
        onBackArrowClick,
        onRightArrowClick,
        backArrowTabIndex,
        backArrowDisable,
        rightArrowTabIndex,
        rightArrowDisable,
        pageTextInfo
    } = { ...props };

    return (
        <TableFooter>
            {renderCondition &&
                <TableRow>
                    <TableCell colSpan={12}>
                        <div style={{ textAlign: "end", justifyContent: "space-evenly" }}>
                            <Typography variant="caption" style={{ fontSize: "0.9rem", fontWeight: "600", float: 'left', padding: '10px' }}>{countLabel} - <b>{totalCount}</b></Typography>
                            <Typography variant="caption" style={{ fontSize: "0.9rem", fontWeight: "600" }}>Page No. - </Typography>
                            <TextField
                                type="number"
                                style={{ width: "4%", marginRight: "1%", marginLeft: "1%" }}
                                ref={pageInputRef}
                                onFocus={() => onInputFocus()}
                                onBlur={() => onInputBlur()}
                                InputProps={{

                                    inputProps: {
                                        style: { textAlign: "center" },
                                        max: totalPageCount, min: 1
                                    }
                                }}
                                onChange={(event) => handleInputChange(event, totalPageCount)}
                                value={inputValue}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ borderRadius: "15%" }}
                                onClick={() => {
                                    onGoToPageClick()
                                }}
                            >Go</Button>
                            <IconButton
                                onClick={() => onBackArrowClick()}
                                tabIndex={backArrowTabIndex}
                                disabled={backArrowDisable}>
                                <ChevronLeftIcon />
                            </IconButton>
                            <Typography variant="caption" style={{ fontSize: "0.9rem", fontWeight: "600" }}> {pageTextInfo} </Typography>
                            <IconButton
                                onClick={() => onRightArrowClick()}
                                tabIndex={rightArrowTabIndex}
                                disabled={rightArrowDisable}>
                                <ChevronRightIcon />
                            </IconButton>
                        </div>
                    </TableCell>
                </TableRow>
            }
        </TableFooter>
    )
}