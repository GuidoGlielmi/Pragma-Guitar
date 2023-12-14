import {createElement, lazy} from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import {Analytics} from '@vercel/analytics/react';
import App from './App.tsx';
import './index.css';
import {ErrorBoundary} from './ErrorBoundary/index.tsx';
import 'intro.js/introjs.css';
import AudioProvider from './contexts/AudioContext';
import {routes} from './constants/routes.tsx';
import LanguageProvider from './contexts/LanguageContext/index.tsx';
import {SkeletonTheme} from 'react-loading-skeleton';
import ToastProvider from './contexts/ToastContext/index.tsx';

const sections = createRoutesFromElements(
  <Route element={<App />}>
    {routes.map(r => (
      <Route key={r.path} path={r.path} element={createElement(lazy(r.element))} />
    ))}
    <Route path='*' element={<Navigate to='/note-generator' replace />} />
  </Route>,
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <ErrorBoundary>
    <SkeletonTheme baseColor='#3f3d4a' highlightColor='#6f6c81'>
      <LanguageProvider>
        <ToastProvider>
          <AudioProvider>
            <RouterProvider router={createBrowserRouter(sections)} />
          </AudioProvider>
        </ToastProvider>
      </LanguageProvider>
    </SkeletonTheme>
    <Analytics />
  </ErrorBoundary>,
  // </React.StrictMode>,
);
