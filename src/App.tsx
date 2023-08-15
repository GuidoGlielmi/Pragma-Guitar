import {useState, useEffect, useContext} from 'react';
import './App.css';
import Tuner from './components/Tuner';
import NoteGenerator from './components/NoteGenerator';
import {AnimatePresence, motion} from 'framer-motion';
import {AudioContext, AudioProps} from './contexts/AudioContext';
import Metronome from './components/Metronome';

const sections = {
  'Note Generator': <NoteGenerator />,
  Metronome: <Metronome />,
  Tuner: <Tuner />,
};

function App() {
  const {start, stop, started} = useContext(AudioContext) as AudioProps;

  const [selectedSection, setSection] = useState<JSX.Element>(sections['Note Generator']);

  useEffect(() => {
    if (started) stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSection]);

  return (
    <main>
      <div className='navBar'>
        {Object.entries(sections).map(([title, section], i) => {
          return (
            <button
              className={`${section === selectedSection ? 'selected' : ''}`}
              key={i}
              onClick={() => setSection(section)}
            >
              {title}
            </button>
          );
        })}
      </div>
      <button onClick={started ? stop : start} id='start'>
        {started ? 'Stop' : 'Start'}
      </button>
      <AnimatePresence mode='wait'>
        <motion.div
          key={selectedSection.type}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.1}}
        >
          {selectedSection}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

export default App;
