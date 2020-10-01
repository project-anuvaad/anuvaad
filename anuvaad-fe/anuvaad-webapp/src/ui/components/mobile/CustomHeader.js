import React from 'react';
import { Button, Header, Left, Body, Right, Icon, Content, Title } from 'native-base';
import DashboardStyle from '../../styles/mobile/DashboardStyles';

const CustomHeader = props => {
  const { title } = props;
  return (
    <Content>
      <Header>
        <Left style={DashboardStyle.headerflex}>
          {/* <Button transparent>
            <Icon
              type="Feather"
              name="menu"
              onPress={() => navigation.openDrawer()}
            />
          </Button> */}
        </Left>
        <Body style={DashboardStyle.headerflex}>
          <Title style={DashboardStyle.headertitle}>{title}</Title>
        </Body>
        <Right style={DashboardStyle.headerflex}>
          <Button transparent>
            <Icon type="Feather" name="search" />
          </Button>
        </Right>
      </Header>
    </Content>
  );
};

export default CustomHeader;
