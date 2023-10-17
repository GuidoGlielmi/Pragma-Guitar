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
  const pitch = frecuency ? pitchFromFrequency(frecuency) : undefined;
  const lowerBandPercentage = frecuency === null ? third / 2 : (1 - detune) * third - third / 2;
  return (
    <section className={S.container}>
      <div>
        <Band pitch={pitch! - 1} percentage={lowerBandPercentage} />
        <div style={{left: `${third + lowerBandPercentage}%`}}>
          {pitch && <NoteWithOctave pitch={pitch} />}
        </div>
        <Band pitch={pitch! + 1} percentage={third * 2 + lowerBandPercentage} />
        <span className={S.xAxis} />
        <span className={S.value} />
      </div>
    </section>
  );
};

type BandProps = {
  pitch: number | null;
  percentage: number;
};

const Band = ({pitch, percentage}: BandProps) => {
  return (
    <AnimatePresence>
      <motion.div
        key={pitch}
        exit={{opacity: 0}}
        transition={{duration: 0.075}}
        style={{left: `${percentage}%`}}
      >
        {!!pitch && <NoteWithOctave pitch={pitch - 1} />}
      </motion.div>
    </AnimatePresence>
  );
};

export default Board;
