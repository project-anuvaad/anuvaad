import React from 'react';
import { useEffect, useState } from 'react';
import DownloadImage from '../../../../flux/actions/apis/download/download_zip_file';
const ShowCorrectedImage = ({ path }) => {
    let [url, setUrl] = useState("")
    const makeDownloadImageAPI = () => {
        let apiObj = new DownloadImage(path)
        fetch(apiObj.apiEndPoint(), {
            method: 'get',
            headers: apiObj.getHeaders().headers
        })
            .then(async response => {
                if (!response.ok) {
                    this.setState({ msg: "Failed to load file..." })
                    console.log("api failed")
                } else {
                    if (!url) {
                        const buffer = new Uint8Array(await response.arrayBuffer());
                        let res = Buffer.from(buffer).toString('base64')
                        fetch("data:image/jpeg;base64," + res)
                            .then(res => res.blob())
                            .then(blob => {
                                let url = URL.createObjectURL(blob);
                                setUrl(url)
                            });
                    }
                }
            }).catch((error) => {
                this.setState({ msg: "Failed to load file..." })
                console.log('api failed because of server or network', error)
            });
    }

    useEffect(() => {
        makeDownloadImageAPI()
    })

    // const selectedArea = (e) => {
    //     console.log(e.clientX, e.clientY, e.screenX, e.screenY)
    // }
    if (!url) {
        return <div style={{ width: '100%', margin: 'auto' }}>
            Loading...
        </div>
    }
    return <div style={{ height: window.innerHeight - 141, maxHeight: window.innerHeight - 141, overflow: 'auto' }}>
        <img
            // style={{ cursor: "grabbing" }} 
            // onMouseUp={selectedArea} 
            width='100%' src={url} />
    </div>

}

export default ShowCorrectedImage;