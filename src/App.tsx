import {useEffect, useContext} from 'react';
import {useLocation} from 'react-router-dom';
import {AudioContext, AudioProps} from './contexts/AudioContext';
import NavBar from './components/Navbar';
import DeviceList from './components/DeviceList';
import './App.css';
import Languages from './components/Language';
import 'react-loading-skeleton/dist/skeleton.css';
import EmailButton from './components/Email';
import Sections from './components/Sections';
import StartButton from './components/StartButton';

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
      <EmailButton />
      <Sections />
    </main>
  );
}

export default App;
