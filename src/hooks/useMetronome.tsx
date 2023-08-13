import {useState, useEffect, useContext} from 'react';
import {AudioContext, AudioProps} from '../contexts/AudioContext';

const useMetronome = (bpm: number, lastPosition: number) => {
  const {source} = useContext(AudioContext) as AudioProps;
  const [position, setPosition] = useState(0);

  useEffect(() => {
    if (!source) return;

    new Audio('/audio/metronome_oct_up.mp3').play();

    const interval = setInterval(() => {
      setPosition(ps => {
        const isLast = ps === lastPosition - 1;
        new Audio(`/audio/metronome${isLast ? '_oct_up' : ''}.mp3`).play();
        return isLast ? 0 : ps + 1;
      });
    }, bpmToFrecuency(bpm));

    return () => {
      setPosition(0);
      clearInterval(interval);
    };
  }, [source, bpm, lastPosition]);

  return position;
};

const bpmToFrecuency = (bpm: number) => (1 / (bpm / 60)) * 1000;

export default useMetronome;
