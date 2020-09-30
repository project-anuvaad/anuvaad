import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

class AppCard extends React.Component {
   
    render() {
        let { header, index, body, bigsize, title, fontSize, showSmall, showZoomed } = this.props
        return (
            <Card className={[bigsize || title ? '' : 'zoom', 'card'].join(' ')} onMouseLeave={this.props.handleHoverOut} onMouseOver={this.props.handleHover && body ? () => { this.props.handleHover(header, body) } : bigsize ? () => { } : (() => { this.props.handleHoverOut() })} style={showSmall ? { minHeight: window.innerHeight / 12 } : (bigsize ? { minHeight: window.innerHeight - window.innerHeight / 4.5, minWidth: '98%' } : (title ? (showZoomed ? { minWidth: '100%', height: window.innerHeight - window.innerHeight / 6 } : {
                display: "flex",
                justifyContent: 'center', alignItems: "center", minWidth: '100%'
            }) : {}))}>
                <CardContent >
                    <Typography color="#4c4c4c" gutterBottom style={fontSize ? { fontSize: fontSize } : (bigsize ? { fontSize: '42px' } : {})}>
                        {header}
                    </Typography>
                    {body ?
                        Array.isArray(body) ?
                            body.map((b) => {
                                return <Typography gutterBottom color="#4c4c4c" style={fontSize ? { fontSize: fontSize } : (bigsize ? { fontSize: '32px', textAlign:'left' } : {})}>
                                    {b + (index === 0 && b.indexOf('।') < 0 && b.indexOf('?') < 0 ? '।' : '')}
                                </Typography>
                            })
                            :
                            <Typography gutterBottom color="#4c4c4c" style={fontSize ? { fontSize: fontSize } : (bigsize ? { fontSize: '32px', textAlign:'left' } : {})}>
                                {body}
                            </Typography>
                        :
                        <div>
                            <span style={{ width: '70%', backgroundColor: '#d3d3d3', display: 'inline-block' }}>&nbsp;</span>
                            <br></br> <br></br>
                            <span style={{ width: '50%', backgroundColor: '#d3d3d3', display: 'inline-block' }}>&nbsp;</span>
                        </div>
                    }
                </CardContent>
            </Card>
        );
    }
}

export default AppCard;
