import {GroupBase, StylesConfig} from 'react-select';

export const customStyles: StylesConfig<
  {
    value: number;
  },
  false,
  GroupBase<{
    value: number;
  }>
> = {
  control: defaultStyles => ({
    ...defaultStyles,
    minWidth: 120,
    height: 30,
    minHeight: 30,
  }),
  indicatorsContainer: provided => ({
    ...provided,
    height: 30,
    minHeight: 30,
  }),
  option: (provided, state) => ({
    ...provided,
    color: '#333',
    ...(state.isDisabled && {backgroundColor: '#00000011'}),
  }),
};

export const customStylesMaxContent: StylesConfig<any, false, GroupBase<any>> = {
  ...customStyles,
  container: provided => ({
    ...provided,
    width: 'max-content',
    margin: 'auto',
  }),
  option: (provided, state) => {
    return {
      ...provided,
      color: state.isSelected ? 'white' : '#464646',
      cursor: 'pointer',
      background: state.isSelected ? '#646cff' : state.isFocused ? '#d7d7d7' : '#f7f7f7',
      ...(state.isSelected && {textShadow: '0 0 4px #777'}),
    };
  },
};

export const metronomeStyles: StylesConfig<
  {
    label: number;
    value: number;
  },
  false,
  GroupBase<{
    label: number;
    value: number;
  }>
> = {
  control: defaultStyles => ({
    ...defaultStyles,
    minHeight: 'unset',
    padding: 0,
    background: 'transparent',
    color: 'white',
    border: 0,
    maxWidth: '100%',
    maxHeight: '100%',
  }),
  singleValue: provided => ({
    ...provided,
    fontFamily: 'painter',
    color: 'white',
  }),
  valueContainer: provided => ({
    ...provided,
    color: 'white',
    padding: 0,
    width: '100%',
    display: 'block',
    flex: 'unset',
  }),
  dropdownIndicator: provided => ({
    ...provided,
    padding: 0,
  }),
  indicatorsContainer: provided => ({
    ...provided,
    width: '100%',
    opacity: 0,
    // padding: 5,
  }),
  option: provided => ({
    ...provided,
    color: '#333',
    padding: 2,
  }),
  menu: provided => ({
    ...provided,
    width: 40,
  }),
};
