import React from 'react';
import ReactDOM from 'react-dom';
import AppRoutes from './web.routes';
import { Provider } from 'react-redux';
import storeFactory from './flux/store/store';

import * as serviceWorker from './serviceWorker';
const TELEMETRY = require('./utils/TelemetryManager')

TELEMETRY.init()

ReactDOM.render(
  <React.StrictMode>
    <Provider store={storeFactory}>
      <AppRoutes />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
