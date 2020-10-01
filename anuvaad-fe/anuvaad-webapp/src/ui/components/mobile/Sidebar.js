// import liraries
import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Text, Container, List, ListItem, Content } from 'native-base';

const routes = [ 'Home', 'Profile', 'Pics', 'Videos', 'Songs', 'Logout' ];

// create a component
class Sidebar extends Component {
	processDrawerItemPressed = (data) => {
		const { navigation } = this.props;
		if (data === 'Logout') {
			AsyncStorage.removeItem('token');
			navigation.navigate('Login');
		}
	};

	render() {
		return (
			<Container>
				<Content>
					<List
						dataArray={routes}
						renderRow={(data) => (
							<ListItem button onPress={() => this.processDrawerItemPressed(data)}>
								<Text>{data}</Text>
							</ListItem>
						)}
					/>
				</Content>
			</Container>
		);
	}
}

// make this component available to the app
export default Sidebar;
