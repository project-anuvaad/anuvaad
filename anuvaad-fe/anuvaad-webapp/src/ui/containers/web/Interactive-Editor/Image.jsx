import React from "react";

class Image extends React.Component {
    constructor(props) {
        super(props);
      }

      render() {
          const { imgObj} = this.props;
          return(
            <div style={{position: "absolute", left: imgObj.text_left + "px", top: imgObj.text_top + "px", width: imgObj.text_width + "px"}}>
                <img width={imgObj.text_width + "px"} height={imgObj.text_height + "px"} src={`data:image/png;base64,${imgObj.base64}`}></img>
            </div>
          )
      }

}

export default Image;