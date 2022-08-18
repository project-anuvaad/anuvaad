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
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from '@material-ui/icons/Close';
import SettingsIcon from '@material-ui/icons/Settings';
import React, { useState, useEffect, useRef } from "react";
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
            // paddingLeft: 0,
            paddingRight: 0,
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

    const logoRef = useRef(null);

    const [state, setState] = useState({
        mobileView: false,
        drawerOpen: false,
    });

    const [headerLogoImg, setHeaderLogoImg] = useState(AnuvaadLogo);

    const [showUserPopoverMenuAnchorEle, setShowUserPopoverMenuAnchorEle] = useState(null);
    const [showSettingsPopoverMenuAnchorEle, setShowSettingsPopoverMenuAnchorEle] = useState(null);

    const assignedOrgId = JSON.parse(localStorage.getItem("userProfile"))?.orgID;
    const role = localStorage.getItem("roles");
    const userName = JSON.parse(localStorage.getItem("userProfile"))?.name.trim();

    const { mobileView, drawerOpen } = state;

    useEffect(() => {
        const setResponsiveness = () => {
            return window.innerWidth < 1300
                ? setState((prevState) => ({ ...prevState, mobileView: true }))
                : setState((prevState) => ({ ...prevState, mobileView: false }));
        };

        setResponsiveness();

        window.addEventListener("resize", () => setResponsiveness());

        return () => {
            window.removeEventListener("resize", () => setResponsiveness());
        };
    }, []);

    // useEffect(()=>{
        
    // //     logoRef.current.src !== AnuvaadLogo ? logoRef.current.src = AnuvaadLogo : null;
    // // },[logoRef.current.src])
    

    // setTimeout(()=>{
    //     if(!logoRef.current.src.includes(AnuvaadLogo)){
    //         logoRef.current.src = AnuvaadLogo
    //     }
    //     console.log("AnuvaadLogo", AnuvaadLogo);
    //     console.log("logoRef.current.src", logoRef.current.src);
    // }, 10000)
    // }, [logoRef.current])

    const displayDesktop = () => {
        return (
            !dontShowHeader && <Toolbar style={{ paddingLeft: 0, paddingRight: 0 }} className={toolbar}>
                {femmecubatorLogo()}
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
            !dontShowHeader && <Toolbar className={toolbar}>
                <div>{femmecubatorLogo()}</div>
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
                        anchor: "right",
                        open: drawerOpen,
                        onClose: handleDrawerClose,
                    }}
                >
                    <div className={drawerContainer}>
                        {/* <div 
                            style={{
                                display : "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginTop: 5,
                                marginBottom: 5
                            }}
                        > */}
                        {/* {femmecubatorLogo} */}
                        <IconButton
                            {...{
                                edge: "start",
                                color: "#2C2799",
                                "aria-label": "menu",
                                "aria-haspopup": "true",
                                onClick: handleDrawerClose,
                            }}
                        // style={{marginLeft : "90%"}}
                        >
                            <CloseIcon />
                        </IconButton>
                        {/* </div> */}
                        <Divider />
                        {getDrawerChoices(handleDrawerClose)}
                    </div>
                </Drawer>
            </Toolbar>
        );
    };

    const getDrawerChoices = (closeDrawerOnMenuClick) => {
        return (
            <>
                <Typography variant="body2" style={{ marginBottom: 3, marginTop: 3 }}>Main Menu -</Typography>
                {headerMenuConfig.map((el, i) => {
                    return el.menuType === "MAIN" && el.rolesAllowed.includes(role) && assignedOrgId !== "NONMT" &&
                        <div>
                            <Button
                                {...{
                                    key: el.id,
                                    // color: "primary",
                                    id: el.id,
                                    onClick: () => {
                                        el.onclick(assignedOrgId);
                                        closeDrawerOnMenuClick()
                                    },
                                    style: { textDecoration: "none", color: "#000000", marginTop : 5 },
                                    // to: href,
                                    component: RouterLink,
                                    className: currentMenu === el.id ? highlightedMenuButton : menuButton,
                                }}
                            >
                                {el.title}
                            </Button>
                        </div>

                })}
                <Typography variant="body2" style={{ marginBottom: 3, marginTop: 3 }}>Settings -</Typography>
                {headerMenuConfig.map((el, i) => {
                    return el.menuType === "SETTINGS" && el.rolesAllowed.includes(role) && assignedOrgId !== "NONMT" &&
                        <div>
                            <Button
                                {...{
                                    key: el.id,
                                    // color: "primary",
                                    id: el.id,
                                    onClick: () => {
                                        el.onclick(assignedOrgId);
                                        closeDrawerOnMenuClick()
                                    },
                                    style: { textDecoration: "none", color: "#000000", marginTop : 5 },
                                    // to: href,
                                    component: RouterLink,
                                    className: currentMenu === el.id ? highlightedMenuButton : menuButton,
                                }}
                            >
                                {el.title}
                            </Button>
                        </div>

                })}
                <Typography variant="body2" style={{ marginBottom: 3, marginTop: 3 }}>Options -</Typography>
                {headerMenuConfig.map((el, i) => {
                    return el.menuType === "USER" && el.rolesAllowed.includes(role) && assignedOrgId !== "NONMT" &&
                        <div>
                            <Button
                                {...{
                                    key: el.id,
                                    // color: "primary",
                                    id: el.id,
                                    onClick: () => {
                                        el.onclick(assignedOrgId);
                                        closeDrawerOnMenuClick()
                                    },
                                    style: { textDecoration: "none", color: "#000000", marginTop : 5 },
                                    // to: href,
                                    component: RouterLink,
                                    className: currentMenu === el.id ? highlightedMenuButton : menuButton,
                                }}
                            >
                                {el.title}
                            </Button>
                        </div>

                })}
            </>

        );
    };

    const femmecubatorLogo = () => {
        return <img 
                    src={headerLogoImg} 
                    className={logo}
                    ref={logoRef}
                    onError={(({currentTarget})=> {
                        currentTarget.onerror = null;
                        if(!currentTarget.src.includes(AnuvaadLogo)){
                            currentTarget.src = AnuvaadLogo;
                            return
                        }
                    })}
                />
        // <img src="/HeaderLogo.svg" alt="header logo" className={logo} />
    };

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
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <IconButton
                                    {...{
                                        edge: "start",
                                        color: "#2C2799",
                                        "aria-label": "menu",
                                        "aria-haspopup": "true",
                                    }}
                                    onClick={(e) => setShowSettingsPopoverMenuAnchorEle(e.currentTarget)}
                                >
                                    <SettingsIcon />
                                </IconButton>
                                <Popover
                                    id={"simple-popover"}
                                    open={Boolean(showSettingsPopoverMenuAnchorEle)}
                                    anchorEl={showSettingsPopoverMenuAnchorEle}
                                    onClose={() => setShowSettingsPopoverMenuAnchorEle(null)}
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
                                                        onClick={() => {
                                                            setShowSettingsPopoverMenuAnchorEle(null)
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
                        </Grid>}
                        <Grid item>
                            <div style={{ display: "flex", alignItems: "center" }}>

                                <Button variant="text" color="primary" onClick={(e) => setShowUserPopoverMenuAnchorEle(e.currentTarget)}><IconButton
                                    {...{
                                        edge: "start",
                                        color: "#2C2799",
                                        "aria-label": "menu",
                                        "aria-haspopup": "true",
                                    }}
                                >
                                    <Avatar style={{ backgroundColor: "#2C2799" }}>{userName?.split("")[0].toLocaleUpperCase()}</Avatar>
                                </IconButton>
                                    {userName?.split(" ")[0]}
                                </Button>
                                <Popover
                                    id={"simple-popover"}
                                    open={Boolean(showUserPopoverMenuAnchorEle)}
                                    anchorEl={showUserPopoverMenuAnchorEle}
                                    onClose={() => setShowUserPopoverMenuAnchorEle(null)}
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
                                                            setShowUserPopoverMenuAnchorEle(null)
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