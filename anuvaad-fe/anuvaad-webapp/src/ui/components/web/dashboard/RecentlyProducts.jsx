import React from "react";
import Avatar from "material-ui/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import IconButton from "material-ui/IconButton";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import { grey400, cyan600, grey900, white } from "material-ui/styles/colors";
import { typography } from "material-ui/styles";
import Wallpaper from "material-ui/svg-icons/device/wallpaper";
import Typography from "@material-ui/core/Typography";
import Tooltip from '@material-ui/core/Tooltip';
import { translate } from '../../../../assets/localisation';
const RecentlyProducts = props => {
  const { data, title } = props;
  const styles = {
    subheader: {
      fontSize: 24,
      fontWeight: typography.fontWeightLight,
      backgroundColor: cyan600,
      color: white
    }
  };

  const iconButtonElement = (
    <IconButton touch tooltipPosition="bottom-left">
      <MoreVertIcon color={grey400} />
    </IconButton>
  );

  const rightIconMenu = (
    <IconMenu iconButtonElement={iconButtonElement}>
      <MenuItem>{translate('recentlyProducts.page.label.view')}</MenuItem>
    </IconMenu>
  );

  return (
    <Paper style={{ backgroundColor: grey900 }}>
      <List>
        <ListSubheader style={styles.subheader}>{title}</ListSubheader>
        {data.map(item => (
          <div key={item.title}>
            <ListItem
              className="title"
              leftAvatar={<Avatar icon={<Wallpaper />} />}
              primaryText={item.title}
              disableTypography
              secondaryText={
                <Typography type="body2" style={{ color: "#FFFFFF" }}>
                  {item.text}
                </Typography>
              }
              rightIconButton={rightIconMenu}
            />
            <Divider inset />
          </div>
        ))}
      </List>
    </Paper>
  );
};

// RecentlyProducts.propTypes = {
//   data: PropTypes.array
// };

export default RecentlyProducts;
