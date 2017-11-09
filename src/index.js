/*REACT ENTRY POINT*/
/*REACT ENTRY POINT*/
/*REACT ENTRY POINT*/

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import './index.css';
import thunk from 'redux-thunk';
import reducers from './reducers/reducer_index';

import NewItemForm from './containers/NewItem/newItemForm';
import ConnectedApp from './containers/App/App';
import registerServiceWorker from './registerServiceWorker';
import NewUser from './containers/Register';
import LoginUser from './containers/Login';
import Logout from './components/Logout';

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunk)
);

ReactDOM.render(

  <Provider store={store}>
      <Router>
        <Route path='/' component={ConnectedApp} /> 
      </Router>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();


