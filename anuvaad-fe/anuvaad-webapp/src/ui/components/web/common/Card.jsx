import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@material-ui/core";

const CustomCard = ({ title, children, cardContent, className }) => {
  return (
    <Grid container alignItems="center" justifyContent="center">
      <Card elevation={3} style={{ border: "none", boxShadow: "none" }}>
        <CardContent>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography
              className={className}
              textAlign={"Left"}
              variant="h3"
            >
              {title}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            {cardContent}
          </Grid>
        </CardContent>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <CardActions
            style={{ marginBottom: "15px", justifyContent: "center" }}
          >
            {children}
          </CardActions>
        </Grid>
      </Card>
    </Grid>
  );
};

export default CustomCard;
