// import liraries
import React, { PureComponent } from 'react';
import { Container, Content, Text, Card, CardItem, connectStyle } from 'native-base';
import DashboardStyle from '../../styles/mobile/DashboardStyles';

// create a component
class Dashboard extends PureComponent {
	render() {
		const { style } = this.props;
		const { cardContainer, cardItemText } = style;
		return (
			// <StyleProviderThemed>
			<Container>
				<Content>
					{/* <Header>
              <Left style={headerflex}>
                <Button transparent>
                  <Icon
                    type="Feather"
                    name="menu"
                    onPress={() => this.props.navigation.openDrawer()}
                  />
                </Button>
              </Left>
              <Body style={headerflex}>
                <Title style={headertitle}>Dashboard</Title>
              </Body>
              <Right style={headerflex}>

              </Right>
            </Header> */}

					<Card style={cardContainer}>
						<CardItem>
							<Text style={cardItemText}>Data</Text>
						</CardItem>
					</Card>
					<Card style={cardContainer}>
						<CardItem>
							<Text style={cardItemText}>Data</Text>
						</CardItem>
					</Card>
					<Card style={cardContainer}>
						<CardItem>
							<Text style={cardItemText}>Data</Text>
						</CardItem>
					</Card>
					<Card style={cardContainer}>
						<CardItem>
							<Text style={cardItemText}>Data</Text>
						</CardItem>
					</Card>
					<Card style={cardContainer}>
						<CardItem>
							<Text style={cardItemText}>Data</Text>
						</CardItem>
					</Card>
					<Card style={cardContainer}>
						<CardItem>
							<Text style={cardItemText}>Data</Text>
						</CardItem>
					</Card>
					<Card style={cardContainer}>
						<CardItem>
							<Text style={cardItemText}>Data</Text>
						</CardItem>
					</Card>
				</Content>
			</Container>
			// </StyleProviderThemed>
		);
	}
}

// make this component available to the app
export default connectStyle('DASHBOARD.STYLE', DashboardStyle)(Dashboard);
