import S from './BeatCircles.module.css';

const BeatCircles = ({numerator, position}: {numerator: number; position: number}) => {
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
                boxShadow: !i && !position ? '0 0 3px white' : 'none',
                background: i === position ? (!i ? 'white' : 'green') : 'black',
              }}
            />
          );
        })}
    </div>
  );
};

export default BeatCircles;
