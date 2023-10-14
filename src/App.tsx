import {useEffect, useContext, Suspense} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {Outlet, useLocation} from 'react-router-dom';
import {AudioContext, AudioProps} from './contexts/AudioContext';
import NavBar from './components/Navbar';
import DeviceList from './components/DeviceList';
import './App.css';

function App() {
  const location = useLocation();
  const {stop, started} = useContext(AudioContext) as AudioProps;

  useEffect(() => {
    if (started) stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <main>
      <DeviceList />
      <NavBar />
      <StartButton />
      <Sections />
    </main>
  );
}

const Sections = () => {
  return (
    <AnimatePresence mode='wait'>
      <Suspense fallback={<div>CARGANDO</div>}>
        <motion.div
          key={location.pathname}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.1}}
        >
          <Outlet />
        </motion.div>
      </Suspense>
    </AnimatePresence>
  );
};

const StartButton = () => {
  const {start, stop, started} = useContext(AudioContext) as AudioProps;
  return (
    <button onClick={started ? stop : start} id='start'>
      {started ? 'Stop' : 'Start'}
    </button>
  );
};

export default App;
