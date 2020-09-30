import { StyleSheet } from 'react-native';


export default StyleSheet.create({
    container: {
        flex: 1,

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },

    logincontainer: {
        marginLeft: 10,
marginRight: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    placeholder: {
        width: '100%',
        margin: 5
    },
    buttonstyle: {
        alignSelf: 'center',
        alignItems: 'center',
        padding: 10

    },
    buttontext: { padding: 10, alignContent: 'center', justifyContent: 'center' },

    cardstyles: {
        margin: 30,
        elevation: 4,
        borderRadius: 4,
        padding: 10,
        marginLeft: 30,
        marginRight: 30
    }
});
