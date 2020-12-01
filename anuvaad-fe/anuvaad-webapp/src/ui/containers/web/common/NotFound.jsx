import React from 'react';
import { translate } from '../../../../assets/localisation';

const NotFound = () => (
  <div>
    <div style={{ textAlign: 'center' }}>
      <center>{translate('notFound.page.text.notFoundError')}</center>
    </div>
  </div>
);

export default NotFound;
