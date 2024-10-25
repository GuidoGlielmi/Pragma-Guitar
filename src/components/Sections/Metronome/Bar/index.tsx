import {metronomeStyles} from '@/constants/reactSelectStyles';
import {MetronomeContext, MetronomeProps} from '@/contexts/MetronomeContext';
import {useContext} from 'react';
import Select from 'react-select';
import S from './Bar.module.css';

const numeratorOptions = Array(16)
  .fill(null)
  .map((_e, i) => ({label: i + 1, value: i + 1}));

const denominatorOptions = [2, 4, 8, 16].map(e => ({label: e, value: e}));

const Bar = () => {
  const {
    bar: [numerator, denominator],
    setNumerator,
    setDenominator,
  } = useContext(MetronomeContext) as MetronomeProps;

  return (
    <div className={S.metric}>
      <Select
        className={S.a}
        isSearchable={false}
        styles={metronomeStyles}
        options={numeratorOptions}
        value={numeratorOptions.find(o => o.label === numerator)}
        onChange={e => setNumerator(e!.value)}
      />
      <p className={S.b}>/</p>
      <Select
        className={S.c}
        isSearchable={false}
        styles={metronomeStyles}
        options={denominatorOptions}
        value={denominatorOptions.find(d => d.label === denominator)}
        onChange={e => setDenominator(e!.value)}
      />
    </div>
  );
};

export default Bar;
