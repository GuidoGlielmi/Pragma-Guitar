import S from '../StringDisplay.module.css';

const String = ({selected, height}: {selected: boolean; height: number}) => {
  return (
    <div
      style={{
        ...(selected && {filter: 'drop-shadow(0 0 7px #999)'}),
      }}
    >
      <div className={S.stringBall} />
      <div className={S.string} style={{height}} />
    </div>
  );
};

export default String;
