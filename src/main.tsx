import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import AudioProvider from './contexts/AudioContext/index.tsx';
import {ErrorBoundary} from './ErrorBoundary/index.tsx';
import 'intro.js/introjs.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AudioProvider>
        <App />
      </AudioProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
