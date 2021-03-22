import React from 'react';
// import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { menuFolderListItems, otherMenuFolderListItems } from './tileData';

const styles = {
	root: {
		flexGrow: 1
	},
	flex: {
		flex: 1
	}
};

class Header extends React.Component {
	state = {
		open: false,
		auth: true,
		anchorEl: null
	};

	handleDrawerOpen = () => {
		this.setState({ open: true });
	};

	handleDrawerClose = () => {
		this.setState({ open: false });
	};

	handleChange = (event, checked) => {
		this.setState({ auth: checked });
	};

	handleMenu = (event) => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleClose = () => {
		this.setState({ anchorEl: null });
	};

	render() {
		const { classes, theme } = this.props;
		const { auth, anchorEl, open } = this.state;
		const openEl = Boolean(anchorEl);

		return (
			<div>
				<AppBar position="fixed" className={classNames(classes.appBar, open && classes.appBarShift)}>
					<Toolbar disableGutters={!open}>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							onClick={this.handleDrawerOpen}
							className={classNames(classes.menuButton, open && classes.hide)}
						>
							<MenuIcon />
						</IconButton>
						<Typography variant="title" color="inherit" className={classes.flex}>
							Base Application
						</Typography>
						{auth && (
							<div>
								<IconButton
									aria-owns={openEl ? 'menu-appbar' : null}
									aria-haspopup="true"
									onClick={this.handleMenu}
									color="inherit"
								>
									<AccountCircle />
								</IconButton>
								<Menu
									id="menu-appbar"
									anchorEl={anchorEl}
									anchorOrigin={{
										vertical: 'top',
										horizontal: 'right'
									}}
									transformOrigin={{
										vertical: 'top',
										horizontal: 'right'
									}}
									open={openEl}
									onClose={this.handleClose}
								>
									<MenuItem onClick={this.handleClose}>Profile</MenuItem>
									<MenuItem onClick={this.handleClose}>My account</MenuItem>
								</Menu>
							</div>
						)}
					</Toolbar>
				</AppBar>
				<Drawer
					position="fixed"
					variant="permanent"
					classes={{
						paper: classNames(classes.drawerPaper, !open && classes.drawerPaperClose)
					}}
					open={open}
				>
					<div className={classes.toolbar}>
						<IconButton onClick={this.handleDrawerClose} style={{ color: 'white' }}>
							{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
						</IconButton>
					</div>
					<Divider />
					<List>{menuFolderListItems}</List>
					<Divider />
					<List>{otherMenuFolderListItems}</List>
				</Drawer>
			</div>
		);
	}
}

// Header.propTypes = {
//   classes: PropTypes.object.isRequired,
//   theme: PropTypes.object.isRequired,
// };

export default withStyles(styles)(Header);
