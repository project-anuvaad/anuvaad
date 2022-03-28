import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#2c3e50'
    },
    headertitle: {
      fontSize: 16,
      // alignSelf: 'center',
      fontWeight: 'bold'
    },
    headerflex: {
        flex: 1
    },
    cardContainer: {
      marginLeft: 10,
      marginRight: 10,
      elevation: 4
    },
    cardItemText: {
      fontSize: 24,
      fontWeight: 'bold',
      flex: 1,
      alignSelf: 'center'
    }
  });
