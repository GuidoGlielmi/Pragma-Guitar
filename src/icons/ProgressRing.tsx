import React from 'react';

type ProgressRingProps = {
  percentage: number;
};

const ProgressRing = ({percentage}: ProgressRingProps) => {
  const radius = 20;
  const strokeWidth = 5;
  const viewBoxSize = radius * 2 + strokeWidth * 2;
  const center = viewBoxSize / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - circumference * (percentage / 100);

  return (
    <svg width='70' height='70' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <linearGradient
          id='ring'
          gradientUnits='userSpaceOnUse'
          x1='0%'
          y1='100%'
          x2='100%'
          y2='0%'
        >
          <stop offset='0%' stopColor='#646cff' />
          <stop offset='30%' stopColor='#646cff' />
          <stop offset='50%' stopColor='#8085e4' />
          <stop offset='70%' stopColor='#646cff' />
          <stop offset='100%' stopColor='#646cff' />
        </linearGradient>
      </defs>
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill='none'
        strokeWidth={strokeWidth}
        stroke='#333'
      />
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill='none'
        strokeWidth={strokeWidth}
        stroke="url('#ring')"
        strokeDasharray={circumference}
        strokeDashoffset={-offset}
        transform={`rotate(-90 ${center} ${center})`}
      />
    </svg>
  );
};

export default ProgressRing;
