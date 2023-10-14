import {useState, useEffect, useContext} from 'react';
import {PitchDetector} from 'pitchy';
import {AudioContext, AudioProps} from '../contexts/AudioContext';
import {getFrecuencyDamper, getMusicalInfoFromFrecuency, getPitch} from '../helpers/pitch';

const buflen = 2048;

const pitchDetector = PitchDetector.forFloat32Array(buflen);

const initialNoteInfo = {
  frecuency: null,
  note: null,
  pitch: null,
  detune: null,
} as NoteInfo;

const buf = new Float32Array(buflen);

const usePitch = ({interval = 50, minFrecuency = 60, maxFrecuency = 10000} = {}): NoteInfo => {
  const {started, getMicInputStream} = useContext(AudioContext) as AudioProps;

  const [noteInfo, setNoteInfo] = useState<NoteInfo>(initialNoteInfo);

  useEffect(() => {
    if (!started) return;

    let updateInterval: number;
    const dampFrecuency = getFrecuencyDamper();
    (async () => {
      await getMicInputStream();
      async function updatePitch() {
        const frecuency = getPitch(minFrecuency, maxFrecuency, pitchDetector, buf);
        if (!frecuency) return;
        const dampedF = dampFrecuency(frecuency);
        setNoteInfo({frecuency: dampedF, ...getMusicalInfoFromFrecuency(dampedF)});
        // console.log('usePitch started!');
      }
      updatePitch();
      updateInterval = setInterval(updatePitch, interval);
    })();
    return () => {
      // console.log('usePitch stopped!');
      clearInterval(updateInterval);
      setNoteInfo(initialNoteInfo);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  return noteInfo;
};

export default usePitch;
