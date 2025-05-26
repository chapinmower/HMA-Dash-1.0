import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom'; // Changed to HashRouter for GitHub Pages
import App from './App';
// import './index.css'; // Removed as the file doesn't exist

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router> {/* HashRouter doesn't need basename */}
      <App />
    </Router>
  </React.StrictMode>
);
