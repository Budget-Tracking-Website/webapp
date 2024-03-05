import logo from './logo.svg';
import './App.css';

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebaseAPI/firebaseConfig';

import ScrollToTop from './components/ScrollToTop.js';
import Loading from './components/loading/index.jsx';
import Login from './authentication/login/index.jsx';
import Dashboard from './dashboard/index.jsx';
import Signup from './authentication/signup/index.jsx';

import Authentication from './firebaseAPI/authentication.js';

function App() {

  initializeApp(firebaseConfig);

  const [initialised, setInitialized] = useState(null);
  let auth = new Authentication();
  useEffect(() => {
    auth.getAccess().then((result) => {
      setInitialized(true);
    }).catch((e) => {
      console.error(e);
    })
  });

  const AuthorizedRoute = ({ element }) => {
    return auth.getIsSignedIn() === true ? element : <Navigate to="/" />;
  };
  const UnauthorizedRoute = ({ element }) => {
    return auth.getIsSignedIn() === true ? <Navigate to="/dashboard" /> : element;
  };

  if (initialised === null) {
    return (
      <Loading/>
    );
  }

  return (
    <div>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<UnauthorizedRoute element={<Login />} />} />
          <Route path="/dashboard" element={<AuthorizedRoute element={<Dashboard />} />} />
          <Route path="/signup" element={<UnauthorizedRoute element={<Signup />} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
