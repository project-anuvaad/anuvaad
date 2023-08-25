import React from 'react';
import { useEffect, useState } from 'react';
import DownloadImage from '../../../../flux/actions/apis/download/download_zip_file';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import '../../../styles/web/ShowCorrectedImage.css'
import set_crop_size from '../../../../flux/actions/apis/view_digitized_document/set_crop_size';
import copylocation from '../../../../flux/actions/apis/view_digitized_document/copy_location';

const ShowCorrectedImage = ({ path, edit_status, set_crop_size, crop, copylocation, copy_status }) => {

    let [info, setUrl] = useState({ url: "", msg: "" })

    const makeDownloadImageAPI = () => {
        let apiObj = new DownloadImage(path)
        fetch(apiObj.apiEndPoint(), {
            method: 'get',
            headers: apiObj.getHeaders().headers
        })
            .then(async response => {
                if (!response.ok) {
                    setUrl({ msg: "Failed to load file..." })
                    // console.log("api failed")
                } else {
                    const buffer = new Uint8Array(await response.arrayBuffer());
                    let res = Buffer.from(buffer).toString('base64')
                    fetch("data:image/jpeg;base64," + res)
                        .then(res => res.blob())
                        .then(blob => {
                            let url = URL.createObjectURL(blob);
                            setUrl({ url })
                        });
                }
            }).catch((error) => {
                setUrl({ msg: "Failed to load file..." })
                // console.log('api failed because of server or network', error)
            });
    }

    useEffect(() => {
        if (!info.url) makeDownloadImageAPI()
    }, [])


    const setImageInfo = (cropData) => {
        set_crop_size(cropData)
        if (copy_status) copylocation()
    }

    if (!info.url) {
        return <div style={{ width: '100%', margin: 'auto' }}>
            Loading...
        </div>
    }
    if (edit_status) {
        return (<ReactCrop
            class="ReactCrop__image"
            style={{ maxWidth: 'none' }}
            src={info.url}
            crop={crop}
            onChange={newCrop => setImageInfo(newCrop)}
        />)
    } else {
        return <div>
            <img width='100%' src={info.url} />
        </div>
    }

}

const mapStateToProps = (state) => {
    return {
        edit_status: state.startediting.status,
        crop: state.cropsizeinfo,
        copy_status: state.copylocation.status
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        set_crop_size,
        copylocation
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowCorrectedImage);