import {useState} from 'react';
import './App.css';
import Tuner from './components/Tuner';
import NoteGenerator from './components/NoteGenerator';
import {AnimatePresence, motion} from 'framer-motion';

const sections = {'Note Generator': <NoteGenerator />, Tuner: <Tuner />};

function App() {
  const [selectedSection, setSection] = useState<JSX.Element>(sections['Note Generator']);

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
