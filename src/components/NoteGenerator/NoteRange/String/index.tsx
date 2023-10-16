import {useState, useContext, useRef} from 'react';
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
import {TuningOptionWithButton} from '../../../common/SelectWithButton';
import {convertStateToTuning} from '../../../../constants/notes';

enum AddStringMessages {
  Upper = 'Add Upper string',
  Lower = 'Add Lower string',
}

const StringNoteRange = () => {
  const {tuning, tunings, setTuning, addString} = useContext(
    NoteGeneratorTuningContext,
  ) as NoteGeneratorTuningProps;

  const boardRef = useRef<HTMLDivElement>(null);

  const addStringHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e.currentTarget.title === AddStringMessages.Upper) {
      addString(true);
      setTimeout(() => boardRef.current?.scrollTo({top: 0, behavior: 'smooth'}));
    } else if (e.currentTarget.title === AddStringMessages.Lower) {
      addString(false);
      setTimeout(() =>
        boardRef.current?.scrollTo({
          top: boardRef.current?.scrollHeight,
          behavior: 'smooth',
        }),
      );
    }
  };

  return (
    <div className={S.stringSection}>
      <Select
        components={{Option: TuningOptionWithButton}}
        isSearchable={false}
        styles={customStylesMaxContent}
        options={tunings}
        value={convertStateToTuning(tuning)}
        onChange={e => {
          setTuning(tunings.indexOf(e as Tuning));
        }}
      />
      <FretModifier />
      <button title={AddStringMessages.Upper} onClick={addStringHandler}>
        Add Upper String
      </button>
      <TuningBoard ref={boardRef} />
      <button title={AddStringMessages.Lower} onClick={addStringHandler}>
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
  const [nameUnavailable, setNameUnavailable] = useState(false);

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
              style={nameUnavailable ? {borderColor: 'red'} : {}}
              disabled={!tuningToSaveName}
              onClick={() => {
                const saved = saveTuning(tuningToSaveName);
                setNameUnavailable(!saved);
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
