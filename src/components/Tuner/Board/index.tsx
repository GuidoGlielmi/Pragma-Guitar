import S from './Board.module.css';
import {centsOffFromClosestPitch, pitchFromFrequency} from '../../../libs/Helpers';
import NoteWithOctave from '../../common/NoteWithOctave';

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
        <div style={{left: `${lowerBandPercentage}%`}} className={S.lowPitchContainer}>
          {pitch && <NoteWithOctave pitch={pitch - 1} />}
        </div>
        <div
          style={{left: `${third + lowerBandPercentage}%`}}
          className={S.middleAndHighPitchContainer}
        >
          {pitch && <NoteWithOctave pitch={pitch} />}
        </div>
        <div
          style={{left: `${third * 2 + lowerBandPercentage}%`}}
          className={S.middleAndHighPitchContainer}
        >
          {pitch && <NoteWithOctave pitch={pitch + 1} />}
        </div>
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
