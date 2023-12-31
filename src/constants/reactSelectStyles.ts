import {GroupBase, StylesConfig} from 'react-select';

export const customStyles = {
  control: (defaultStyles: any) => ({
    ...defaultStyles,
    minWidth: 120,
    height: 30,
    minHeight: 30,
  }),
  indicatorsContainer: (provided: any, _state: any) => ({
    ...provided,
    height: 30,
    minHeight: 30,
  }),
  option: (provided: any, _state: any) => ({
    ...provided,
    color: '#333',
  }),
};

export const customStylesMaxContent = {
  ...customStyles,
  container: (provided: any) => ({
    ...provided,
    width: 'max-content',
    margin: 'auto',
  }),
  option: (provided: any, state: any) => {
    return {
      ...provided,
      color: state.isSelected ? 'white' : '#464646',
      cursor: 'pointer',
      background: state.isSelected ? '#646cff' : state.isFocused ? '#d7d7d7' : '#f7f7f7',
      ...(state.isSelected && {textShadow: '0 0 4px #777'}),
    };
  },
};

export const metronomeStyles = {
  control: (defaultStyles: any) => ({
    ...defaultStyles,
    minHeight: 'unset',
    padding: 0,
    background: 'transparent',
    color: 'white',
    border: 0,
    maxWidth: '100%',
    maxHeight: '100%',
  }),
  singleValue: (provided: any, _state: any) => ({
    ...provided,
    fontFamily: 'painter',
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
