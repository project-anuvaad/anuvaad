
import React from 'react';
import Button from '@material-ui/core/Button';
import Pagination from "material-ui-flat-pagination";

export default class AlertDialog extends React.Component {
render(){
    var {offset,count,offset,handleChangePage} = this.props
    
return(
<Pagination
                      align="right"
                      limit={1}
                      offset={offset}
                      centerRipple={true}
                      total={(count) }
                      onClick= {
                        handleChangePage
                      }
                    />

)}}