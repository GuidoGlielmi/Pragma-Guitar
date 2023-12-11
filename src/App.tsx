import {useEffect, useContext, Suspense} from 'react';
import {m, LazyMotion, domAnimation} from 'framer-motion';
import {Outlet, useLocation} from 'react-router-dom';
import {AudioContext, AudioProps} from './contexts/AudioContext';
import NavBar from './components/Navbar';
import DeviceList from './components/DeviceList';
import './App.css';
import useTranslation from './hooks/useTranslation';
import Languages from './components/Language';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function App() {
  const location = useLocation();
  const {stop, started} = useContext(AudioContext) as AudioProps;

  useEffect(() => {
    if (started) stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <main>
      <Languages />
      <DeviceList />
      <NavBar />
      <StartButton />
      <Sections />
    </main>
  );
}

const Sections = () => {
  return (
    <Suspense fallback={<Skeleton width='min(40vw, 400px)' height='min(50vh, 500px)' />}>
      <LazyMotion features={domAnimation}>
        <m.div
          key={location.pathname}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.25}}
        >
          <Outlet />
        </m.div>
      </LazyMotion>
    </Suspense>
  );
};

const StartButton = () => {
  const {start, stop, started} = useContext(AudioContext) as AudioProps;

  const [startString, stopString] = useTranslation(['start', 'stop']);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Enter' && (started ? stop : start)();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  return (
    <button onClick={started ? stop : start} id='start'>
      {started ? stopString : startString}
    </button>
  );
};

export default App;
