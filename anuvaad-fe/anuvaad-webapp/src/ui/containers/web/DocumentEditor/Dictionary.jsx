import React from "react";
import Popover from "@material-ui/core/Popover";
import Button from "@material-ui/core/Button";
import CopyIcon from "@material-ui/icons/FileCopy";
import Tooltip from '@material-ui/core/Tooltip';

class Dictionay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayCopy: null
        }
    }

    render() {
        return (
            <Popover
                id="menu-appbar"
                open={this.props.isOpenDictionaryOnly}
                open={true}
                anchorReference="anchorPosition"
                anchorPosition={{ top: this.props.dictionaryY + 10, left: this.props.dictionaryX + 5 }}
                onClose={() => this.props.handelDictionaryClose()}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            >
                <div style={{ padding: "8px", width: "300px" }}>
                    <span style={{ padding: "0px 5px", display: "inline-block", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", width: "295px" }}>
                        Meaning of {" "} <span style={{ fontWeight: "bold" }}>{this.props.selectedSentence}</span>
                    </span>
                    <hr style={{ color: "#00000014", marginTop: "0px" }} />
                    <div style={{ maxHeight: "250px", maxWidth: "300px", overflow: "auto" }} onMouseLeave={() => this.setState({ displayCopy: null })}>
                        {
                            this.props.parallel_words.length>0 ? this.props.parallel_words.map((word, i) => {
                                return <Button key={i} style={{
                                    textTransform: "none",
                                    width: "100%",
                                    justifyContent: "left",
                                }}
                                    onMouseOver={() => this.setState({ displayCopy: i })}
                                >
                                    {
                                        this.state.displayCopy === i ? this.renderData("copy", word) : this.renderData("", word)
                                    }

                                </Button>
                            })
                            : "Not found in dictionary"
                        }
                    </div>

                </div>
            </Popover >
        )
    }

    renderData = (type, text) => {
        if (type === "copy") {
            return (<div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
                <div style={{ width: "80%", textAlign: 'left', textAlign: "justify" }}>{text}</div>
                <div style={{ width: "20%", textAlign: 'right' }}>
                    <Tooltip title="Copy" placement="right">
                        <CopyIcon style={{ width: "20px" }} onClick={() => this.props.handleMeaningCopy(text) }></CopyIcon>
                    </Tooltip>
                </div>
            </div>
            )
        } else {
            return (
                <div style={{ textAlign: "justify" }} >{text}</div>
            )
        }
    }
}

export default Dictionay;
