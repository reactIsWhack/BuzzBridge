import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import store from './app/store.jsx';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './styles/General.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
