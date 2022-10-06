import React from "react";
import ReactDOM from 'react-dom/client';
import App from './App';
import Axios from "axios";


// Set up Axios
Axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
Axios.defaults.withCredentials = true;

//Axios.defaults.baseURL = 'https://stormdamagemap.com:8442'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);