import React from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Friends from './pages/Friends';

axios.defaults.withCredentials = true;

const App = () => {
  return (
    <>
      <ToastContainer />
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
        <Route path="/friends" element={<Friends />}></Route>
      </Routes>
    </>
  );
};

export default App;
