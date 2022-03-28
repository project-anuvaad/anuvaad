import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import storeFactory from './flux/store/store';
import registerServiceWorker from './registerServiceWorker';

import AppRoutes from './web.routes';

ReactDOM.render(
  <Provider store={storeFactory}>
    <AppRoutes />
  </Provider>,
  document.getElementById('root')
);


registerServiceWorker();
