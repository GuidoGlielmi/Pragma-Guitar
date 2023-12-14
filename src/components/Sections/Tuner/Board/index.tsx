import S from './Board.module.css';
import NoteWithOctave from '../../../common/NoteWithOctave';
import {useEffect, useRef} from 'react';
import Band from './Band';

type BoardProps = {
  pitch: TPitchToPlay;
  detune: TPitchToPlay;
};

const third = 33;

const Board = ({detune, pitch}: BoardProps) => {
  const prevNoteInfoRef = useRef<BoardProps>();

  useEffect(() => {
    if (detune !== null) prevNoteInfoRef.current = {pitch, detune};
  }, [pitch, detune]);

  const lowerBandPercentage =
    prevNoteInfoRef.current === undefined
      ? third / 2
      : pitch === null || detune === null
      ? (1 - prevNoteInfoRef.current.detune! / 100) * third - third / 2
      : (1 - detune / 100) * third - third / 2;

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
        <div style={{left: `${third + lowerBandPercentage}%`}}>
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
          percentage={third * 2 + lowerBandPercentage}
        />
        <span className={S.xAxis} />
        <span className={S.value} />
      </div>
    </section>
  );
};

export default Board;
