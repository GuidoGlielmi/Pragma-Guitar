import {useEffect} from 'react';
import useMetronome from '../../hooks/useMetronome';
import Select, {GroupBase, StylesConfig} from 'react-select';
import S from './Metronome.module.css';
import useNumberInput from '../../hooks/useNumberInput';
import useTap from '../../hooks/useTap';

const numeratorOptions = Array(16)
  .fill(null)
  .map((_e, i) => ({label: i + 1, value: i + 1}));

const denominatorOptions = [2, 4, 8, 16].map(e => ({label: e, value: e}));

const Metronome = () => {
  const {input, value: bpm, changeHandler} = useNumberInput({min: 1, max: 250, initialValue: 120});

  const [[numerator, denominator], setBar, position] = useMetronome({bpm: +bpm});

  const [tapButton, tappedBpm] = useTap();

  useEffect(() => {
    if (tappedBpm) changeHandler(tappedBpm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tappedBpm]);

  return (
    <div className={S.container}>
      <h2>
        Beat {input} {tapButton}
      </h2>
      <div>
        <Select
          className={S.a}
          isSearchable={false}
          styles={customStyles}
          options={numeratorOptions}
          value={{label: numerator, value: numerator}}
          onChange={e => setBar(ps => [e!.value, ps[1]])}
        />
        <p className={S.b}>/</p>
        <Select
          className={S.c}
          isSearchable={false}
          styles={customStyles}
          options={denominatorOptions}
          value={{label: denominator, value: denominator}}
          onChange={e => setBar(ps => [ps[0], e!.value])}
        />
      </div>
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
    </div>
  );
};

export default Metronome;

const customStyles = {
  control: (defaultStyles: any) => ({
    ...defaultStyles,
    width: 30,
    height: 30,
    minHeight: 30,
    padding: 0,
    background: 'transparent',
    color: 'white',
    border: 0,
  }),
  singleValue: (provided: any, _state: any) => ({
    ...provided,
    color: 'white',
  }),
  valueContainer: (provided: any, _state: any) => ({
    ...provided,
    color: 'white',
    padding: 0,
    width: '100%',
    display: 'block',
    flex: 'unset',
  }),
  dropdownIndicator: (provided: any, _state: any) => ({
    ...provided,
    padding: 0,
  }),
  indicatorsContainer: (provided: any, _state: any) => ({
    ...provided,
    width: '100%',
    opacity: 0,
    // padding: 5,
  }),
  option: (provided: any, _state: any) => ({
    ...provided,
    color: '#333',
    padding: 2,
  }),
  menu: (provided: any, _state: any) => ({
    ...provided,
    width: 40,
  }),
} as StylesConfig<
  {
    label: number;
    value: number;
  },
  false,
  GroupBase<{
    label: number;
    value: number;
  }>
>;
