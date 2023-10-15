import {useState, useContext} from 'react';
import Select from 'react-select';
import {customStylesMaxContent} from '../../../../constants/reactSelectStyles';
import S from './String.module.css';
import {
  NoteGeneratorTuningContext,
  NoteGeneratorTuningProps,
} from '../../../../contexts/NoteGeneratorTuningContext';
import TuningBoard from './TuningBoard';
import {AnimatePresence, motion} from 'framer-motion';
import TickButton from '../../../../icons/TickButton';
import Cancel from '../../../../icons/Cancel';

const StringNoteRange = () => {
  const {tuning, tunings, setTuning, addString} = useContext(
    NoteGeneratorTuningContext,
  ) as NoteGeneratorTuningProps;

  return (
    <div className={S.stringSection}>
      <Select
        isSearchable={false}
        styles={customStylesMaxContent}
        options={tunings}
        value={tuning}
        onChange={e => {
          setTuning(tunings.indexOf(e!));
        }}
      />
      <FretModifier />
      <button title='Add Upper string' onClick={() => addString(true)}>
        Add Upper String
      </button>
      <TuningBoard />
      <button title='Add Lower string' onClick={() => addString(false)}>
        Add Lower String
      </button>
      <TuningSaver />
    </div>
  );
};

const FretModifier = () => {
  const {fretsAmount, changeFretsAmount} = useContext(
    NoteGeneratorTuningContext,
  ) as NoteGeneratorTuningProps;
  return (
    <div className={S.fretsContainer}>
      <h4>Frets</h4>
      <button onClick={() => changeFretsAmount(-1)}>-</button>
      <p>{fretsAmount}</p>
      <button onClick={() => changeFretsAmount(1)}>+</button>
    </div>
  );
};

const TuningSaver = () => {
  const {saveTuning} = useContext(NoteGeneratorTuningContext) as NoteGeneratorTuningProps;

  const [showTuningToSave, setShowTuningToSave] = useState(false);
  const [tuningToSaveName, setTuningToSaveName] = useState('');

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        className={S.saveTuningContainer}
        {...animation}
        key={showTuningToSave ? 'showTuningToSave' : 'hideTuningToSave'}
      >
        {!showTuningToSave ? (
          <button
            className={S.saveTuningButton}
            title='Save Tuning'
            onClick={() => setShowTuningToSave(true)}
          >
            Save Tuning
          </button>
        ) : (
          <>
            <input
              value={tuningToSaveName}
              onChange={e => setTuningToSaveName(e.target.value)}
              placeholder='Name'
            />
            <button
              disabled={!tuningToSaveName}
              onClick={() => {
                saveTuning(tuningToSaveName);
                setShowTuningToSave(false);
              }}
            >
              <TickButton />
            </button>
            <button title='Cancel' onClick={() => setShowTuningToSave(false)}>
              <Cancel />
            </button>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

const animation = {
  initial: {opacity: 0},
  animate: {opacity: 1},
  exit: {opacity: 0},
};

export default StringNoteRange;
