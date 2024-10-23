const TickButtonIcon = ({color = '#ccc'}: {color?: string}) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='30px'
      height='30px'
      viewBox='0 0 24 24'
      fill='none'
    >
      <path
        d='M4.89163 13.2687L9.16582 17.5427L18.7085 8'
        stroke={color}
        strokeWidth='2.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default TickButtonIcon;
