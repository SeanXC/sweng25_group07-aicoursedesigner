import { BrowserRouter } from "react-router-dom";
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CourseDataProvider } from './components/Context/CourseDataContext'; // import for context provider 
import { UserProfileProvider } from "./components/Context/UserProfileContext";



const root = ReactDOM.createRoot(document.getElementById('root'));
 root.render(
  <React.StrictMode>
    <UserProfileProvider>

    <CourseDataProvider>
      <App />
    </CourseDataProvider>
    </UserProfileProvider>

 </React.StrictMode>
);

/* const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

*/
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
