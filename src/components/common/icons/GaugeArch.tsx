const GaugeArchIcon = () => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='-5 -15 210 100' width={'100%'} height={'100%'}>
      <defs>
        <linearGradient id='gradientArc' x1='0%' y1='0%' x2='100%' y2='0%'>
          <stop offset='0%' stop-color='#e92626' stopOpacity={0.9} />
          <stop offset='50%' stop-color='#f0ff6a' stopOpacity={0.9} />
          <stop offset='100%' stop-color='#6dff59' stopOpacity={0.9} />
        </linearGradient>
      </defs>
      <path
        fill='none'
        stroke='url(#gradientArc)'
        stroke-width='30'
        d='M 10 90 A 80 80 0 0 1 190 90'
      />
      <path
        fill='none'
        stroke='url(#gradientArc)'
        d='M 25 90 A 65 65 0 0 1 175 90'
        stroke-width='60'
      />
    </svg>
  );
};
// transform='rotate(-75, 90, 90)'

export default GaugeArchIcon;
