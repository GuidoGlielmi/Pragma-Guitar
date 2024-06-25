import useMetronome from '../../../hooks/useMetronome';
import Bar from './Bar';
import BeatCircles from './BeatCircles';
import Header from './Header';
import Incrementer from './Incrementer';
import S from './Metronome.module.css';

const Metronome = () => {
  const [[numerator, denominator], setBar, position] = useMetronome();

  return (
    <div className={`${S.container} sectionBorder`}>
      <Header />
      <Bar numerator={numerator} denominator={denominator} setBar={setBar} />
      <BeatCircles numerator={numerator} position={position} />
      <Incrementer position={position} />
    </div>
  );
};

export default Metronome;
