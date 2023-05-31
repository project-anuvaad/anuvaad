import { AppBar, Box, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import Header from "./ui/pages/component/common/Header";


const App = (props) => {
const {component} = props;


  return (
     <div style={{ textAlign: "center"}}>
      <Header />
      <Grid sx={{overflowX: 'hidden'}}>
        {component}
      </Grid>
     
      </div>
  );
};
export default App;
