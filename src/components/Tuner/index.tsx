import {useContext} from 'react';
import {getDetunePercent} from '../../libs/Helpers';
import {AudioContext, AudioProps} from '../../contexts/AudioContext';
import usePitch from '../../hooks/usePitch';
import './Tuner.css';
const Tuner = () => {
  const {started, start, stop} = useContext(AudioContext) as AudioProps;
  const {note, notification, detune, frecuency, pitch} = usePitch();

  return (
    <div className='flex justify-center items-center h-screen'>
      {notification && <div>Please, bring your instrument near to the microphone!</div>}
      <div className='flex flex-col items-center'>
        <div>
          <div className='flex items-start font-mono'>
            <span>{note}</span>
            <span className='bg-green-600 p-1 px-2 text-white rounded-lg'>{pitch}</span>
          </div>
          <div className='detuneBar'>
            <div
              className='detuneLeft'
              style={{
                width: (detune !== null && detune < 0 ? getDetunePercent(detune) : '50') + '%',
              }}
            />
            <div
              className='detuneRight'
              style={{
                width: (detune !== null && detune > 0 ? getDetunePercent(detune) : '50') + '%',
              }}
            />
          </div>
          <div className='mt-2 text-xs text-gray-400'>
            <span>{frecuency}</span>
          </div>
        </div>
        {!started ? <button onClick={start}>Start</button> : <button onClick={stop}>Stop</button>}
      </div>
    </div>
  );
};

export default Tuner;
