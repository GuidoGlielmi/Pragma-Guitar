import './Ellipsis.css';

const Ellipsis = ({size = 5}) => {
  return (
    <div className='ellipsis'>
      <div style={{width: size, height: size}} />
      <div style={{width: size, height: size}} />
      <div style={{width: size, height: size}} />
    </div>
  );
};
export default Ellipsis;
