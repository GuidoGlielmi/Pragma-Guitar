import {MetronomeContext, MetronomeProps} from '@/contexts/MetronomeContext';
import {useContext} from 'react';
import S from './BeatCircles.module.css';

const BeatCircles = ({beatPosition}: {beatPosition: number}) => {
  const {
    bar: [numerator],
  } = useContext(MetronomeContext) as MetronomeProps;

  return (
    <div className={S.beatContainer}>
      {Array(numerator)
        .fill(null)
        .map((_e, i) => {
          return (
            <div
              key={i}
              className={S.beatUnit}
              style={{
                boxShadow: !i && !beatPosition ? '0 0 3px #fbff82' : 'none',
                background: i === beatPosition ? (!i ? 'white' : 'green') : 'black',
              }}
            />
          );
        })}
    </div>
  );
};

export default BeatCircles;
