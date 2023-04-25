
const LoginStyles = theme => ({
    container: {
        alignItems: "center",
        marginTop: 10,
        width: "100%",
        textAlign: "center",
        paddingBottom: 25
    },
    introPageLinkCard: {
        cursor: "pointer", 
        width: "30%", 
        border: "0.5px solid rgba(0,0,0,0.4)", 
        padding: 5, 
        maxHeight: "270px", 
        backgroundColor: "#F5F5F5",
        textDecoration: "none",
        borderRadius: 10,
            "&:hover": {
            backgroundColor: "#0606065c",
            color: "white"
        }
    },
    backgroundContainerBox: {
        background: "url('img/slide1-bg.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "5% 5%",
        display: "flex",
        columnGap: "15rem",
        // alignItems: "center",
        justifyContent: "space-around",
        flexWrap: "wrap",
        rowGap: "5rem",
        height: "110%"
    },
    linkStyle: {
        textDecoration: "none",
        display: "contents"
    }
})

export default LoginStyles;