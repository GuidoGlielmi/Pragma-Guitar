import {useState, useEffect, useContext} from 'react';
import {UsePitch} from './usePitch';
import {pitchFromFrecuency, centsOffFromPitch} from '../libs/Helpers';
import {PitchDetector} from 'pitchy';
import {AudioContext, AudioProps} from '../contexts/AudioContext';
import {notes} from '../constants/notes';

let interval: number;

const initialTries = 7;
const buflen = 2048;
const buf = new Float32Array(buflen);

type Condition = {
  delay?: number;
} & (
  | {
      target?: number | null;
      condition: (pitch: number) => boolean;
    }
  | {
      target: number | null;
      condition?: (pitch: number) => boolean;
    }
);

type UseCorrectPitch = UsePitch & {correct: boolean};

/**
 * @param condition Should be memoized
 */
const useCorrectPitch = ({target, condition, delay}: Condition): UseCorrectPitch => {
  const {audio, analyser, started} = useContext(AudioContext) as AudioProps;

  const [pitchDetector, setPitchDetector] = useState<PitchDetector<Float32Array> | null>(null);
  const [note, setNote] = useState<Note | null>(null);
  const [frecuency, setFrecuency] = useState<number | null>(null);
  const [pitch, setPitch] = useState<number | null>(null);
  const [detune, setDetune] = useState<number | null>(null);
  const [notification, setNotification] = useState(false);
  const [correct, setCorrect] = useState(false);

  useEffect(() => {
    setPitchDetector(PitchDetector.forFloat32Array(buflen));
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (correct || !pitchDetector) return;

    let remainingTries = initialTries;
    let savedPitch: number;
    const checkPitch = () => {
      analyser.getFloatTimeDomainData(buf);
      const [frecuency, clarity] = pitchDetector.findPitch(buf, audio.sampleRate);
      if (clarity < 0.5) return;
      const pitch = pitchFromFrecuency(frecuency);
      const note = Object.values(notes)[pitch % 12] as keyof typeof notes;
      const detune = centsOffFromPitch(frecuency, pitch);
      setFrecuency(~~frecuency);
      setNote(note);
      setDetune(detune);
      setNotification(false);
      setPitch(pitch);
      console.log({pitch, target, condition: condition?.(savedPitch)});

      if (savedPitch === undefined) savedPitch = pitch;
      else {
        if (condition?.(pitch) || (savedPitch === pitch && pitch === target)) {
          console.log({remainingTries});
          if (!remainingTries) {
            clearInterval(interval);
            return setCorrect(true);
          }
          remainingTries--;
        } else {
          savedPitch = pitch;
          remainingTries = initialTries;
        }
      }
    };
    interval = setInterval(checkPitch, delay);
    return () => {
      setCorrect(false);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, condition, started]);

  const getNotePosition = () => {
    return pitch ? Math.floor(pitch / 12) - 1 : null;
  };

  return {
    detune,
    note,
    pitch,
    getNotePosition,
    frecuency,
    correct,
    notification,
  };
};

export default useCorrectPitch;
