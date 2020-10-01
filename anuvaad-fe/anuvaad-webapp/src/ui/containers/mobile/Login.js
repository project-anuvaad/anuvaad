// import liraries
import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import PropTypes from 'prop-types';
import { Container, Content, Input, Button, Text, CardItem, connectStyle, Card } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LoginAPI from '../../../flux/actions/apis/login';
import APITransport from '../../../flux/actions/apitransport/apitransport';
import { StyleProviderThemed } from '../../styles/mobile/StyleProviderThemed';
import LoginStyles from '../../styles/mobile/LoginStyles';

// create a component
class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: ''
		};
	}

	componentDidMount() {
		AsyncStorage.removeItem('token');
	}

	componentDidUpdate() {
		const { user } = this.props;
		if (user.token != null) {
			AsyncStorage.setItem('token', user.token);
			return Actions.dashboard();
		}
		return null;
	}

	processLoginButtonPressed = () => {
		const { APITransporter } = this.props;
		const { email, password } = this.state;
		const apiObj = new LoginAPI(email, password);
		APITransporter(apiObj);
		return Actions.dashboard();
	};

	render() {
		const { style } = this.props;
		const { container, logincontainer, placeholder, buttonstyle, cardstyles } = style;
		return (
			<StyleProviderThemed>
				<Container style={container}>
					<Content>
						<Card style={cardstyles}>
							<CardItem style={logincontainer}>
								<Input
									rounded
									placeholder="Email/UserName"
									onChange={this.processInputReceived}
									style={placeholder}
								/>
								<Input
									rounded
									placeholder="Password"
									secureTextEntry
									onChange={this.processInputReceived}
									style={placeholder}
								/>
								<Button primary style={buttonstyle} onPress={this.processLoginButtonPressed}>
									<Text uppercase={false}> Login </Text>
								</Button>
							</CardItem>
						</Card>
					</Content>
				</Container>
			</StyleProviderThemed>
		);
	}
}

Login.propTypes = {
	user: PropTypes.object.isRequired,
	style: PropTypes.object.isRequired,
	APITransporter: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
	user: state.login,
	apistatus: state.apistatus
});

// eslint-disable-next-line
const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(
		{
			APITransporter: APITransport
		},
		dispatch
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(connectStyle('STYLE.LOGIN', LoginStyles)(Login));
