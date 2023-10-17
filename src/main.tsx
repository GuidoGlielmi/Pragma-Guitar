import {lazy, Suspense} from 'react';
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
import {lazyRoutes} from './constants/routes.tsx';
import LanguageProvider from './contexts/LanguageContext/index.tsx';

const sections = createRoutesFromElements(
  <Route element={<App />}>
    {lazyRoutes.map(r => (
      <Route key={r.path} path={r.path} lazy={r.element} />
    ))}
    <Route path='*' element={<Navigate to='/note-generator' replace />} />
  </Route>,
);
ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <ErrorBoundary>
    <LanguageProvider>
      <AudioProvider>
        <RouterProvider router={createBrowserRouter(sections)} />
      </AudioProvider>
    </LanguageProvider>
    <Analytics />
  </ErrorBoundary>,
  // </React.StrictMode>,
);
