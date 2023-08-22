import S from './Board.module.css';
import {centsOffFromClosestPitch, pitchFromFrequency} from '../../../libs/Helpers';
import NoteWithOctave from '../../common/NoteWithOctave';
import {motion, AnimatePresence} from 'framer-motion';

type BoardProps = {
  pitch: number | null;
  frecuency: number | null;
  detune: number | null;
};

const third = 33;

const Board = ({frecuency}: BoardProps) => {
  const detune = centsOffFromClosestPitch(frecuency || 0) / 100;
  const pitch = frecuency ? pitchFromFrequency(frecuency) : null;
  const lowerBandPercentage = frecuency === null ? third / 2 : (1 - detune) * third - third / 2;
  return (
    <section className={S.container}>
      <div>
        <AnimatePresence>
          <motion.div
            key={pitch}
            exit={{opacity: 0}}
            transition={{duration: 0.075}}
            style={{left: `${lowerBandPercentage}%`}}
            className={S.lowPitchContainer}
          >
            {pitch && <NoteWithOctave pitch={pitch - 1} />}
          </motion.div>
        </AnimatePresence>
        <div
          style={{left: `${third + lowerBandPercentage}%`}}
          className={S.middleAndHighPitchContainer}
        >
          {pitch && <NoteWithOctave pitch={pitch} />}
        </div>
        <AnimatePresence>
          <motion.div
            key={pitch}
            exit={{opacity: 0}}
            transition={{duration: 0.075}}
            style={{left: `${third * 2 + lowerBandPercentage}%`}}
            className={S.middleAndHighPitchContainer}
          >
            {pitch && <NoteWithOctave pitch={pitch + 1} />}
          </motion.div>
        </AnimatePresence>
        <span className={S.xAxis} />
        <span className={S.value} />
      </div>
    </section>
  );
};

// function haveDifferentSigns(a: number, b: number) {
//   return (a < 0 && b >= 0) || (a >= 0 && b < 0);
// }

export default Board;
