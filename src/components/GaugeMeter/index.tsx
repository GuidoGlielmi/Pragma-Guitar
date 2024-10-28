import {
  GAUGE_MAX_DEGREE_RANGE,
  HIGHER_MIC_AMPLITUDE_THRESHOLD,
  LOWER_MIC_AMPLITUDE_THRESHOLD,
} from '@/constants';
import {AudioContext, AudioProps} from '@/contexts/AudioContext';
import {useContext, useEffect, useState} from 'react';
import GaugeArchIcon from '../common/icons/GaugeArch';

const GaugeMeter = () => {
  const {started, subscribeMicListener} = useContext(AudioContext) as AudioProps;

  const [amplitude, setAmplitude] = useState<-1 | 0 | 1>(-1);

  useEffect(() => {
    if (!started) return;
    const fn = ({amplitude}: GetPitchReturnType) => {
      if (amplitude < LOWER_MIC_AMPLITUDE_THRESHOLD) return setAmplitude(-1);
      else if (amplitude < HIGHER_MIC_AMPLITUDE_THRESHOLD) return setAmplitude(0);
      else return setAmplitude(1);
    };
    subscribeMicListener(fn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  return (
    <div className='gaugeContainer'>
      <div>
        <GaugeArchIcon />
        <div
          className='gaugeNeedle'
          style={{
            background: 'linear-gradient(to bottom, #c7c5db 50%, transparent 50%)',
            transform: `rotateZ(${
              amplitude === -1
                ? -GAUGE_MAX_DEGREE_RANGE
                : amplitude === 0
                ? 0
                : GAUGE_MAX_DEGREE_RANGE
            }deg)`,
          }}
        />
      </div>
    </div>
  );
};

export default GaugeMeter;
