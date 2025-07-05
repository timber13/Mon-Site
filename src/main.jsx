
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ResultatsProvider } from './contexts/ResultatsContext';
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ResultatsProvider>
    <App />
  </ResultatsProvider>
);
