import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import AudioProvider from './contexts/AudioContext/index.tsx';
import {ErrorBoundary} from './ErrorBoundary/index.tsx';
import 'intro.js/introjs.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <meta property='og:title' content='Pragma Guitar' />
    <meta property='og:site_name' content='Pragma Guitar' />
    <meta property='og:description' content='Guitar exercises to have fun practicing' />
    <meta property='og:url' content='https://pragma-guitar.vercel.app' />
    <meta property='og:image' content='https://pragma-guitar.vercel.app/pragma-guitar.svg' />
    <meta property='og:image:type' content='image/png' />

    <meta name='twitter:card' content='summary_large_image' />
    <meta property='twitter:title' content='Pragma Guitar' />
    <meta property='twitter:description' content='Guitar exercises to have fun practicing' />
    <meta property='twitter:image' content='https://pragma-guitar.vercel.app/pragma-guitar.svg' />
    <ErrorBoundary>
      <AudioProvider>
        <App />
      </AudioProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
