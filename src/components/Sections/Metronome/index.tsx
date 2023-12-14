import {useEffect} from 'react';
import useMetronome from '../../../hooks/useMetronome';
import S from './Metronome.module.css';
import useNumberInput from '../../../hooks/useNumberInput';
import useTap from '../../../hooks/useTap';
import {maxBPS, minBPS} from '../../../constants/notes';
import BeatCircles from './BeatCircles';
import Header from './Header';
import Bar from './Bar';

const Metronome = () => {
  const {
    input,
    value: bpm,
    changeHandler,
  } = useNumberInput({min: minBPS, max: maxBPS, initialValue: 120});

  const [[numerator, denominator], setBar, position] = useMetronome({bpm: +bpm});

  const [tapButton, tappedBpm] = useTap();

  useEffect(() => {
    if (tappedBpm) changeHandler(tappedBpm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tappedBpm]);

  return (
    <div className={`${S.container} sectionBorder`}>
      <Header input={input} tapButton={tapButton} />
      <Bar numerator={numerator} denominator={denominator} setBar={setBar} />
      <BeatCircles numerator={numerator} position={position} />
    </div>
  );
};

export default Metronome;
