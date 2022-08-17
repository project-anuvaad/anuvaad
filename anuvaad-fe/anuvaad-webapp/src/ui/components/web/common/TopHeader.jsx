import {
    AppBar,
    Toolbar,
    Typography,
    makeStyles,
    Button,
    IconButton,
    Drawer,
    Link,
    MenuItem,
    Paper,
    Avatar,
    Box,
    Divider
} from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import MenuIcon from "@material-ui/icons/Menu";
import SettingsIcon from '@material-ui/icons/Settings';
import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import AnuvaadLogo from "../../../../assets/AnuvaadLogo.svg";
import configs from "../../../../configs/configs";
import headerMenuConfig from "../../../../configs/headerMenuConfig";

const useStyles = makeStyles((theme) => ({
    header: {
        backgroundImage: "linear-gradient(to right, rgb(241, 241, 241), rgb(255, 255, 255))",
        paddingRight: "40px",
        paddingLeft: "40px",
        "@media (max-width: 900px)": {
            paddingLeft: 0,
        },
    },
    logo: {
        height: "2rem",
        width: "6rem"
    },
    menuButton: {
        // fontFamily: "Open Sans, sans-serif",
        padding: 15,
        fontWeight: 700,
        color: "#000000",
        size: "18px",
        marginLeft: "38px",
        '&:hover': {
            backgroundColor: "#E0E0E0",
            color: "#000000",
            padding: 15,
            borderRadius: 10
        }
    },
    highlightedMenuButton: {
        backgroundColor: "#E0E0E0",
        borderRadius: 10,
        padding: 15,
        fontWeight: 700,
        color: "#000000",
        size: "18px",
        marginLeft: "38px",
        // backgroundColor: "#E0E0E0",
        // color: "#000000",
        // padding: 15,
        // borderRadius: 10,
        // fontWeight: 700,
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
    },
    desktopMenuContainer: {
        display: "flex",
        justifyContent: "space-between",
    },
    drawerContainer: {
        padding: "20px 30px",
    },
    paper: {
        height: 50,
        width: 50,
    },
    control: {
        padding: theme.spacing(2),
    },
    popoverStyle: {
        padding: 20,
        alignItems: "start"
    },
    userMenuButton: {
        // width: "100%",
        marginTop: 5,
        '&:hover': {
            backgroundColor: "#E0E0E0"
        }
    },
    activeUserMenuButton: {
        // width: "100%",
        marginTop: 5,
        backgroundColor: "#E0E0E0"
    },
    userMenuButtonText: {
        // width : "100%"
    }
}));

const headersData = [
    {
        label: "Translate Document",
        href: "/listings",
    },
    {
        label: "Document Digitization",
        href: "/mentors",
    },
    {
        label: "My Glossary",
        href: "/account",
    },
    // {
    //     label: "Log Out",
    //     href: "/logout",
    // },
];

export default function TopHeader(props) {
    const { header, logo, menuButton, toolbar, desktopMenuContainer, drawerContainer, popoverStyle, highlightedMenuButton, userMenuButton, activeUserMenuButton, userMenuButtonText } = useStyles();

    const { currentMenu, dontShowHeader } = props;

    const [state, setState] = useState({
        mobileView: false,
        drawerOpen: false,
    });

    const assignedOrgId = JSON.parse(localStorage.getItem("userProfile"))?.orgID;
    const role = localStorage.getItem("roles");
    const userName = JSON.parse(localStorage.getItem("userProfile"))?.name;

    const { mobileView, drawerOpen } = state;

    useEffect(() => {
        const setResponsiveness = () => {
            return window.innerWidth < 900
                ? setState((prevState) => ({ ...prevState, mobileView: true }))
                : setState((prevState) => ({ ...prevState, mobileView: false }));
        };

        setResponsiveness();

        window.addEventListener("resize", () => setResponsiveness());

        return () => {
            window.removeEventListener("resize", () => setResponsiveness());
        };
    }, []);

    const displayDesktop = () => {
        return (
            !dontShowHeader && <Toolbar className={toolbar}>
                {femmecubatorLogo}
                <div>{getMenuButtons()}</div>
                <div>{PopOverMenuButtons()}</div>
            </Toolbar>
        );
    };

    const displayMobile = () => {
        const handleDrawerOpen = () =>
            setState((prevState) => ({ ...prevState, drawerOpen: true }));
        const handleDrawerClose = () =>
            setState((prevState) => ({ ...prevState, drawerOpen: false }));

        return (
            !dontShowHeader && <Toolbar>
                <IconButton
                    {...{
                        edge: "start",
                        color: "#2C2799",
                        "aria-label": "menu",
                        "aria-haspopup": "true",
                        onClick: handleDrawerOpen,
                    }}
                >
                    <MenuIcon />
                </IconButton>

                <Drawer
                    {...{
                        anchor: "left",
                        open: drawerOpen,
                        onClose: handleDrawerClose,
                    }}
                >
                    <div className={drawerContainer}>{getDrawerChoices()}</div>
                </Drawer>

                <div>{femmecubatorLogo}</div>
            </Toolbar>
        );
    };

    const getDrawerChoices = () => {
        return headersData.map(({ label, href }) => {
            return (
                <Link
                    {...{
                        component: RouterLink,
                        to: href,
                        color: "inherit",
                        style: { textDecoration: "none" },
                        key: label,
                    }}
                >
                    <MenuItem style={{ color: "black" }}>{label}</MenuItem>
                </Link>
            );
        });
    };

    const femmecubatorLogo = (
        <img src={AnuvaadLogo} className={logo} />
    );

    const getMenuButtons = () => {
        return (
            <Grid container className={desktopMenuContainer}>
                {headerMenuConfig.map((el, i) => {
                    return (
                        el.menuType === "MAIN" && el.rolesAllowed.includes(role) && assignedOrgId !== "NONMT" && <Button
                            {...{
                                key: el.id,
                                // color: "primary",
                                id: el.id,
                                onClick: () => { el.onclick(assignedOrgId) },
                                style: { textDecoration: "none", color: "#000000" },
                                // to: href,
                                component: RouterLink,
                                className: currentMenu === el.id ? highlightedMenuButton : menuButton,
                            }}
                        >
                            {el.title}
                        </Button>
                    );
                })}
            </Grid>

        )
    };

    const PopOverMenuButtons = () => {
        return (
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" spacing={2}>
                        {(role !== "SUPERADMIN" && role !== "ADMIN") && <Grid item>
                            <PopupState variant="popover" popupId="demo-popup-popover">
                                {(popupState) => (
                                    <div style={{ display: "flex", alignItems: "center" }}>

                                        <IconButton
                                            {...{
                                                edge: "start",
                                                color: "#2C2799",
                                                "aria-label": "menu",
                                                "aria-haspopup": "true",
                                                // onClick: handleDrawerOpen,
                                            }}
                                            {...bindTrigger(popupState)}
                                        >
                                            <SettingsIcon />
                                        </IconButton>
                                        <Popover
                                            {...bindPopover(popupState)}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'center',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'center',
                                            }}
                                            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                                        >
                                            <Grid container direction="column" className={popoverStyle}>
                                                {
                                                    headerMenuConfig.map((el, i) => {
                                                        return (
                                                            el.menuType === "SETTINGS" && el.rolesAllowed.includes(role) && assignedOrgId !== "NONMT" &&
                                                            <Button 
                                                                variant="text" 
                                                                className={currentMenu === el.id ? activeUserMenuButton : userMenuButton} 
                                                                // {...bindTrigger(popupState)}
                                                                onClick={() =>{ 
                                                                    popupState.close()
                                                                    el.onclick(assignedOrgId)
                                                                }}
                                                                >
                                                                <Typography className={userMenuButtonText} variant="button">{el.title}</Typography>
                                                            </Button>
                                                        )
                                                    })
                                                }
                                            </Grid>
                                        </Popover>
                                    </div>
                                )}
                            </PopupState>
                        </Grid>}
                        <Grid item>
                            <PopupState variant="popover" popupId="demo-popup-popover">
                                {(popupState) => (
                                    <div style={{ display: "flex", alignItems: "center" }}>

                                        <Button variant="text" color="primary" {...bindTrigger(popupState)}><IconButton
                                            {...{
                                                edge: "start",
                                                color: "#2C2799",
                                                "aria-label": "menu",
                                                "aria-haspopup": "true",
                                                // onClick: handleDrawerOpen,
                                            }}
                                            {...bindTrigger(popupState)}
                                        >
                                            <Avatar style={{backgroundColor : "#2C2799"}}>{userName?.split("")[0].toLocaleUpperCase()}</Avatar>
                                        </IconButton>
                                            {userName?.split(" ")[0]}
                                        </Button>
                                        <Popover
                                            {...bindPopover(popupState)}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'center',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'center',
                                            }}
                                            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                                        >
                                            <Grid container direction="column" className={popoverStyle}>
                                                <Grid item>
                                                    <Typography variant="caption">Signed in as <b>{role ? role : ""}</b></Typography>
                                                </Grid>
                                                <Divider style={{ marginTop: 5, marginBottom: 5, width: "100%" }} />
                                                {
                                                    headerMenuConfig.map((el, i) => {
                                                        return (
                                                            el.menuType === "USER" && el.rolesAllowed.includes(role) &&
                                                            <Button 
                                                                variant="text" 
                                                                className={currentMenu === el.id ? activeUserMenuButton : userMenuButton} 
                                                                onClick={() => { 
                                                                    popupState.close()
                                                                    el.onclick(assignedOrgId) 
                                                                }}
                                                            >
                                                                <Typography className={userMenuButtonText} variant="button">{el.title}</Typography>
                                                            </Button>
                                                        )
                                                    })
                                                }
                                            </Grid>
                                        </Popover>
                                    </div>
                                )}
                            </PopupState>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
    }

    return (
        <header>
            <AppBar className={header}>
                {mobileView ? displayMobile() : displayDesktop()}
            </AppBar>
        </header>
    );
}