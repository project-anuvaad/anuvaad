import React from 'react';

import { Container, Content, Header, StyleProvider } from 'native-base';
import getTheme from '../../../../native-base-theme/components';
import material from '../../../../native-base-theme/variables/material';

import CustomHeader from '../../components/mobile/CustomHeader';

class Layout extends React.PureComponent {
  render() {
    // eslint-disable-next-line
		const Component = this.props.component;
    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <Content>
            <Header>
              <CustomHeader title="Boilerplate" />
            </Header>
            <Component />
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default Layout;
