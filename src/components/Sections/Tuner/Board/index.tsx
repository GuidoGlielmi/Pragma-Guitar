import {useEffect, useRef} from 'react';
import NoteWithOctave from '../../../common/NoteWithOctave';
import Band from './Band';
import S from './Board.module.css';

type BoardProps = {
  pitch: TPitchToPlay;
  detune: TPitchToPlay;
};

const THIRD = 33;
const SIXTH = THIRD / 2;

const Board = ({detune, pitch}: BoardProps) => {
  const prevNoteInfoRef = useRef<BoardProps>();

  useEffect(() => {
    if (detune !== null) prevNoteInfoRef.current = {pitch, detune};
  }, [pitch, detune]);

  const lowerBandPercentage =
    prevNoteInfoRef.current === undefined
      ? SIXTH
      : pitch !== null && detune !== null
      ? (1 - detune / 100) * THIRD - SIXTH
      : (1 - prevNoteInfoRef.current.detune! / 100) * THIRD - SIXTH;

  return (
    <section className={S.container}>
      <div>
        <Band
          pitch={
            pitch
              ? pitch - 1
              : prevNoteInfoRef.current?.pitch
              ? prevNoteInfoRef.current?.pitch - 1
              : null
          }
          percentage={lowerBandPercentage}
        />
        <div style={{left: `${THIRD + lowerBandPercentage}%`}}>
          <NoteWithOctave pitch={pitch ?? prevNoteInfoRef.current?.pitch ?? null} />
        </div>
        <Band
          pitch={
            pitch
              ? pitch + 1
              : prevNoteInfoRef.current?.pitch
              ? prevNoteInfoRef.current?.pitch + 1
              : null
          }
          percentage={THIRD * 2 + lowerBandPercentage}
        />
        <span className={S.xAxis} />
        <span className={S.value} />
      </div>
    </section>
  );
};

export default Board;
