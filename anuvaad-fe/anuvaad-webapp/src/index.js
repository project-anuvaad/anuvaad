import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import storeFactory from './flux/store/store';
// import registerServiceWorker, { unregister } from './registerServiceWorker';
// import './index.css';

import AppRoutes from './web.routes';

// unregister()
ReactDOM.render(
  <Provider store={storeFactory}>
    <AppRoutes />
  </Provider>,
  document.getElementById('root')
);


// registerServiceWorker();

