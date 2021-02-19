import React from "react";
import { Paper, Divider } from "@material-ui/core";
import { Textfit } from "react-textfit";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DownloadFile from '../../../../flux/actions/apis/download/download_zip_file';


class DownloadDigitziedDoc extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            text: ''
        };
        this.action = null
    }


    renderChild = (region) => {
        let width = (region.boundingBox.vertices[1].x - region.boundingBox.vertices[0].x) + 'px'
        let height = (region.boundingBox.vertices[2].y - region.boundingBox.vertices[0].y) + 'px'
        let top = (region.boundingBox.vertices[0].y) + 'px'
        let left = (region.boundingBox.vertices[0].x) + 'px'
        return (
            <div style={{
                position: "absolute",
                height: height,
                width: width,
                top: top,
                left: left,
                zIndex: 2,
            }}
                id={region.identifier}
                key={region.identifier}
            >

                {region['children'] &&
                    region['children'].map(line => this.renderText(line, region))
                }
            </div>
        );
    }

    renderText = (line, region) => {
        return (
            <div style={{
                position: "absolute",
                zIndex: 2,
                width: line.boundingBox.vertices[1].x - line.boundingBox.vertices[0].x + 'px',
                height: line.boundingBox.vertices[2].y - line.boundingBox.vertices[0].y + 'px',
                top: line.boundingBox.vertices[0].y - region.boundingBox.vertices[0].y + 'px',
                left: line.boundingBox.vertices[0].x - region.boundingBox.vertices[0].x + 'px',
            }}
                key={region.identifier}
            >
                {

                    this.renderTextSpan(line, region)
                }
            </div>
        )
    }

    renderTextSpan = (word, region) => {
        return (
            <div
                style={{
                    zIndex: 2,
                    color: 'black',
                    padding: '0%',
                    fontSize: region.avg_size + 'px',
                    width: word.boundingBox.vertices[1].x - word.boundingBox.vertices[0].x + 'px',
                    top: word.boundingBox.vertices[0].y + 'px',
                    left: word.boundingBox.vertices[0].x + 'px',
                }}
                id={word.block_id}
                onDoubleClick={() => { this.handleSelectedSentenceId(word) }}
            >
                <Textfit mode="single" style={{ width: '100%' }} min={1} max={parseInt(Math.ceil(region.avg_size))} >
                    {word.text}
                </Textfit>
            </div>
        )
    }

    renderImage = (image, region) => {
        let width = region.boundingBox.vertices[1].x - region.boundingBox.vertices[0].x + 'px'
        let height = region.boundingBox.vertices[2].y - region.boundingBox.vertices[0].y + 'px'
        let img = image.replace('upload/', '')

        let style = {
            position: "relative",
            width: width,
            height: height,
            overflow: "hidden",
            zIndex: 1
        }

        this.getBGImage(img)
        return (
            <div style={style} key={region.identifier}>
                <img width={width} height={height} src={this.state.url} alt=""></img>
            </div>
        )
    }

    getBGImage = (image) => {
        let obj = new DownloadFile(image);
        const apiReq1 = fetch(obj.apiEndPoint(), {
            method: "get",
            headers: obj.getHeaders().headers,
        })
            .then(async (response) => {
                if (!response.ok) {
                    this.setState({
                        dialogMessage: "Failed to download file...",
                        timeOut: 3000,
                        variant: "info",
                    });
                    console.log("api failed");
                } else {
                    const buffer = new Uint8Array(await response.arrayBuffer());
                    let res = Buffer.from(buffer).toString("base64");
                    if (!this.state.url)
                        fetch("data:image/jpeg;base64," + res)
                            .then(res => res.blob())
                            .then(blob => {
                                let url = URL.createObjectURL(blob);
                                this.setState({ url })
                            });
                }
            })
            .catch((error) => {
                this.setState({
                    dialogMessage: "Failed to download file...",
                    timeOut: 3000,
                    variant: "info",
                });
                console.log("api failed because of server or network", error);
            });
    }

    render() {
        let pId = "divToPrint" + this.props.index
        let page = this.props.page
        if (page) {
            let width = page['vertices'] && page.vertices[1].x - page.vertices[0].x + 'px'
            let height = page['vertices'] && page.vertices[2].y - page.vertices[0].y + 'px'
            return (
                <div>
                    <Paper elevation={2} style={{ position: 'relative', width: width, height: height }}>
                        {page['regions'].map(region => this.renderChild(region))}
                        {page['regions'].map(region => {
                            if (region.class === 'BGIMAGE') {
                                return this.renderImage(region.data, region)
                            }
                        })
                        }
                    </Paper>
                    <Divider />
                </div>
            )
        }
        return (
            <div></div>
        )
    }

}

const mapStateToProps = state => ({
    document_contents: state.document_contents,
    block_page: state.block_highlight.page_no,
});

const mapDispatchToProps = dispatch => bindActionCreators(
    {
    },
    dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(DownloadDigitziedDoc);
