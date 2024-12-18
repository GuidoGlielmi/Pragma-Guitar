import {useContext, useEffect} from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import {useLocation} from 'react-router-dom';
import './App.css';
import DeviceList from './components/DeviceList';
import GaugeMeter from './components/GaugeMeter';
import Languages from './components/Language';
import NavBar from './components/Navbar';
import SuspensedSection from './components/Sections';
import Social from './components/Social';
import StartButton from './components/StartButton';
import {AudioContext, AudioProps} from './contexts/AudioContext';

function App() {
  const location = useLocation();
  const {stop, started} = useContext(AudioContext) as AudioProps;

  useEffect(() => {
    if (started) stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <main>
      <h1>Pragma Guitar</h1>
      <Languages />
      <DeviceList />
      <NavBar />
      <StartButton />
      <Social />
      <GaugeMeter />
      <SuspensedSection />
    </main>
  );
}

export default App;
