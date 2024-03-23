import React from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import Home from './pages/Home';

axios.defaults.withCredentials = true;

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route
        path="/login"
        element={
          <div>
            <Login />
          </div>
        }
      ></Route>
    </Routes>
  );
};

export default App;
