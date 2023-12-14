import {motion} from 'framer-motion';
import NoteWithOctave from '@/components/common/NoteWithOctave';

type BandProps = {
  pitch: TPitchToPlay;
  percentage: number;
};

const Band = ({pitch, percentage}: BandProps) => {
  return (
    <motion.div
      key={pitch}
      exit={{opacity: 0}}
      transition={{duration: 0.075}}
      style={{left: `${percentage}%`}}
    >
      <NoteWithOctave pitch={pitch} />
    </motion.div>
  );
};

export default Band;
