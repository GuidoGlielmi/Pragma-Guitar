import Select from 'react-select';
import {metronomeStyles} from '../../../constants/reactSelectStyles';
import S from './Bar.module.css';

const numeratorOptions = Array(16)
  .fill(null)
  .map((_e, i) => ({label: i + 1, value: i + 1}));

const denominatorOptions = [2, 4, 8, 16].map(e => ({label: e, value: e}));

type BarProps = {
  numerator: number;
  denominator: number;
  setBar: React.Dispatch<React.SetStateAction<[number, number]>>;
};

const Bar = ({numerator, denominator, setBar}: BarProps) => {
  return (
    <div className={S.metric}>
      <Select
        className={S.a}
        isSearchable={false}
        styles={metronomeStyles}
        options={numeratorOptions}
        value={{label: numerator, value: numerator}}
        onChange={e => setBar(ps => [e!.value, ps[1]])}
      />
      <p className={S.b}>/</p>
      <Select
        className={S.c}
        isSearchable={false}
        styles={metronomeStyles}
        options={denominatorOptions}
        value={{label: denominator, value: denominator}}
        onChange={e => setBar(ps => [ps[0], e!.value])}
      />
    </div>
  );
};

export default Bar;
