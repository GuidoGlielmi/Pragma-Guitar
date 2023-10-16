import {useContext} from 'react';
import {
  NoteGeneratorTuningContext,
  NoteGeneratorTuningProps,
} from '../../../../../contexts/NoteGeneratorTuningContext';
import ChevronDown from '../../../../../icons/ChevronDown';
import NoteWithOctave from '../../../../common/NoteWithOctave';
import S from './StringDisplay.module.css';
import {
  NoteGeneratorContext,
  NoteGeneratorProps,
} from '../../../../../contexts/NodeGeneratorContext';
import {AnimatePresence, motion} from 'framer-motion';

interface StringDisplayProps {
  height: number;
  pitch: StringStateValue;
  index: number;
  selected: boolean;
  select: (i: number) => void;
}

const StringDisplay = ({
  height,
  pitch: {id, pitch},
  index,
  selected,
  select,
}: StringDisplayProps) => {
  const {changePitchRange} = useContext(NoteGeneratorContext) as NoteGeneratorProps;
  const {stringModifiedChecker, incrementPitch, decrementPitch, removeString} = useContext(
    NoteGeneratorTuningContext,
  ) as NoteGeneratorTuningProps;

  const modifyTuningHandler = (n: number) => {
    if (n > 0) incrementPitch(index);
    else decrementPitch(index);
    if (selected) changePitchRange(ps => [ps[0], ps[1]! + n]);
  };

  return (
    <div className={S.stringContainer}>
      <div>
        <input type='radio' name='string' checked={selected} onChange={() => select(index)} />
        <AnimatePresence mode='wait'>
          <motion.div
            key={pitch}
            transition={{
              opacity: {duration: 0.05},
              color: {duration: 0.3, ease: 'easeIn'},
            }}
            initial={{opacity: 0, color: '#b53f3f'}}
            animate={{
              opacity: 1,
              color: '#e2e2e2',
            }}
            exit={{opacity: 0}}
          >
            <NoteWithOctave pitch={pitch} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div
        style={{
          ...(selected && {filter: 'drop-shadow(0 0 7px #999)'}),
        }}
      >
        <div className={S.stringBall} />
        <div className={S.string} style={{height}} />
      </div>
      <div>
        <div>
          <button
            title='Increase semitone'
            className='button'
            style={{
              transform: 'rotateZ(180deg)',
              ...(stringModifiedChecker(id) === true && {background: '#ff5151ad'}),
            }}
            onClick={() => modifyTuningHandler(1)}
          >
            <ChevronDown color='white' />
          </button>
          <button
            title='Decrease semitone'
            style={{
              transform: 'translateY(2px)',
              ...(stringModifiedChecker(id) === false && {background: '#ff5151ad'}),
            }}
            className='button'
            onClick={() => modifyTuningHandler(-1)}
          >
            <ChevronDown color='white' />
          </button>
        </div>
        <button title='Remove string' onClick={() => removeString(id)}>
          X
        </button>
      </div>
    </div>
  );
};

export default StringDisplay;
