import {Analytics} from '@vercel/analytics/react';
import 'intro.js/introjs.css';
import {createElement, lazy} from 'react';
import ReactDOM from 'react-dom/client';
import {SkeletonTheme} from 'react-loading-skeleton';
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import App from './App.tsx';
import {ErrorBoundary} from './ErrorBoundary/index.tsx';
import AudioProvider from './contexts/AudioContext.tsx';
import LanguageProvider from './contexts/LanguageContext.tsx';
import ToastProvider from './contexts/ToastContext.tsx';
import './index.css';
import {routes} from './routes/index.tsx';

// eslint-disable-next-line react-refresh/only-export-components
const Router = createRoutesFromElements(
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
            <RouterProvider router={createBrowserRouter(Router)} />
          </AudioProvider>
        </ToastProvider>
      </LanguageProvider>
    </SkeletonTheme>
    <Analytics />
  </ErrorBoundary>,
  // </React.StrictMode>,
);
