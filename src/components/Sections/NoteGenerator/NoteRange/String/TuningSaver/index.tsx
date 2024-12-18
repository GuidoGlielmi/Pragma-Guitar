import {
  NoteGeneratorTuningContext,
  NoteGeneratorTuningProps,
} from '@/contexts/NoteGeneratorTuningContext';
import useTranslation from '@/hooks/useTranslation';
import CancelIcon from '@/icons/Cancel';
import TickButtonIcon from '@/icons/TickButton';
import {AnimatePresence, motion} from 'framer-motion';
import {useContext, useEffect, useState} from 'react';
import S from './TuningSaver.module.css';

const TuningSaver = () => {
  const {saveTuning, tuning} = useContext(NoteGeneratorTuningContext) as NoteGeneratorTuningProps;

  const [showTuningToSave, setShowTuningToSave] = useState(false);

  const [tuningToSaveName, setTuningToSaveName] = useState(tuning.deletable ? tuning.label : '');
  const [nameUnavailable, setNameUnavailable] = useState(false);

  const [saveTuningString, nameString, nameInUseString, saveString, cancelString] = useTranslation([
    'saveTuning',
    'name',
    'nameAlreadyUsed',
    'save',
    'cancel',
  ]);

  useEffect(() => {
    setTuningToSaveName(tuning.deletable ? tuning.label : '');
  }, [tuning]);

  const saveTuningHandler = () => {
    const saved = saveTuning(tuningToSaveName);
    if (!saved) return setNameUnavailable(true);
    setShowTuningToSave(false);
  };

  const cancelSave = () => {
    setShowTuningToSave(false);
    setNameUnavailable(false);
    setTuningToSaveName('');
  };

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
            {saveTuningString}
          </button>
        ) : (
          <>
            <input
              value={tuningToSaveName}
              onChange={e => setTuningToSaveName(e.target.value)}
              style={nameUnavailable ? {borderColor: 'red'} : {}}
              placeholder={nameString}
            />
            {nameUnavailable && (
              <p
                style={{
                  position: 'absolute',
                  padding: 3,
                  background: 'white',
                  color: '#222',
                  borderRadius: 5,
                  transform: 'translateY(110%)',
                }}
              >
                {nameInUseString}
              </p>
            )}
            <button title={saveString} disabled={!tuningToSaveName} onClick={saveTuningHandler}>
              <TickButtonIcon />
            </button>
            <button title={cancelString} onClick={cancelSave}>
              <CancelIcon />
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

export default TuningSaver;
