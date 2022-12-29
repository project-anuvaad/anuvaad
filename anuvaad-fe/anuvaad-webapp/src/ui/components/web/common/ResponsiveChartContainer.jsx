import React from 'react';
import { useMediaQuery, useMediaQueries } from '@react-hook/media-query'
import { ResponsiveContainer } from 'recharts';
import { Box } from '@material-ui/core';

const ResponsiveChartContainer = (props) => {
    const matches = useMediaQuery('only screen and (max-width: 700px)');
    
    if (matches) {
        return <Box style={{ overflowX: "scroll" }}>
            {props.children}
        </Box>
    } else {
        return <ResponsiveContainer width={"100%"} height={600}>
            {props.children}
        </ResponsiveContainer>
    }
}

export default ResponsiveChartContainer;