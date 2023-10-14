// import {useState, useEffect, useContext, useRef} from 'react';
// import {pitchFromFrequency, centsOffFromPitch} from '../libs/Helpers';
// import {PitchDetector} from 'pitchy';
// import {AudioContext, AudioProps, audioCtx, micInputStream} from '../contexts/AudioContext';
// import {notes} from '../constants/notes';
// import {persistentChecker} from '../helpers/persistentChecker';
// import {cancelableThrottle} from '../helpers/cancelableThrottle';

// let interval: number;

// const buflen = 2048;
// const buf = new Float32Array(buflen);

// type Condition = {
//   delay?: number;
//   minFrecuency?: number;
//   maxFrecuency?: number;
// } & (
//   | {
//       target?: number | null;
//       condition: (pitch: number) => boolean;
//     }
//   | {
//       target: number | null;
//       condition?: (pitch: number) => boolean;
//     }
// );

// type UseCorrectPitch = UsePitch & {correct: boolean; currStreak: number; maxStreak: number};

// /**
//  * @param condition Should be memoized
//  */
// const useCorrectPitch = ({
//   target,
//   condition,
//   delay = 75,
//   minFrecuency = 60,
//   maxFrecuency = 10000,
// }: Condition): UseCorrectPitch => {
//   const {
//     started,
//     analyserNode,
//     setNotification,
//     setMicInputStream: setMicInputStream,
//   } = useContext(AudioContext) as AudioProps;

//   const pitchDetector = useRef(PitchDetector.forFloat32Array(buflen));

//   const [note, setNote] = useState<Note | null>(null);
//   const [frecuency, setFrecuency] = useState<number | null>(null);
//   const [pitch, setPitch] = useState<number | null>(null);
//   const [detune, setDetune] = useState<number | null>(null);
//   const [correct, setCorrect] = useState(false);
//   const [currStreak, setCurrStreak] = useState(0);
//   const [maxStreak, setMaxStreak] = useState(0);

//   useEffect(() => {
//     if (!micInputStream && started) {
//       setMicInputStream();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [started]);

//   useEffect(() => {
//     if (correct) setCurrStreak(ps => ps + 1);
//   }, [correct]);

//   useEffect(() => {
//     setMaxStreak(ps => Math.max(ps, currStreak));
//   }, [currStreak]);

//   useEffect(() => {
//     if (!started || !pitchDetector) return;

//     if (!correct) setCurrStreak(0);

//     const notificationIntent = cancelableThrottle(() => setNotification(true), 500);
//     const cancelNotificationIntent = () => notificationIntent(true);

//     const notificationCancelIntent = cancelableThrottle(() => setNotification(false), 200);
//     const cancelNotificationCancelIntent = () => notificationCancelIntent(true);

//     let savedPitch: number;

//     const getPitch = () => {
//       analyserNode.getFloatTimeDomainData(buf); // must be done for each note
//       const [frecuency, clarity] = pitchDetector.current.findPitch(buf, audioCtx.sampleRate);

//       if (frecuency < minFrecuency || frecuency > maxFrecuency) return;

//       const pitch = pitchFromFrequency(frecuency);
//       const note = Object.values(notes)[pitch % 12] as keyof typeof notes;
//       const detune = centsOffFromPitch(frecuency, pitch);

//       // console.log({
//       //   frecuency,
//       //   pitch,
//       //   note,
//       //   clarity,
//       //   status: clarity >= 0.95 ? 'Clear' : clarity <= 0.85 ? 'Unclear' : 'Almost clear',
//       // });

//       if (clarity <= 0.95) {
//         if (clarity >= 0.87) {
//           cancelNotificationCancelIntent();
//           notificationIntent();
//         }
//         return;
//       }

//       cancelNotificationIntent();
//       notificationCancelIntent();
//       setNotification(false);
//       setFrecuency(~~frecuency);
//       setNote(note);
//       setDetune(detune);
//       setPitch(pitch);

//       return pitch;
//     };

//     const checker = (pitch: number) => {
//       const isCorrect =
//         !!pitch && (condition?.(pitch) || (savedPitch === pitch && pitch === target));
//       if (!isCorrect) {
//         savedPitch = pitch;
//       }
//       return isCorrect;
//     };

//     const onSuccess = () => {
//       setCorrect(true);
//     };

//     const consultPlayedNote = persistentChecker(getPitch, checker, onSuccess);

//     interval = setInterval(consultPlayedNote, delay);

//     return () => {
//       setCorrect(false);
//       setNotification(false);
//       clearInterval(interval);
//       cancelNotificationIntent();
//       cancelNotificationCancelIntent();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [target, condition, started]);

//   return {
//     detune,
//     note,
//     pitch,
//     frecuency,
//     correct,
//     currStreak,
//     maxStreak,
//   };
// };

// export default useCorrectPitch;

// // const checkPitch = () => {
// //   analyser.getFloatTimeDomainData(buf);
// //   const [frecuency, clarity] = pitchDetector.findPitch(buf, audio.sampleRate);

// //   const pitch = pitchFromFrequency(frecuency);
// //   const note = Object.values(notes)[pitch % 12] as keyof typeof notes;
// //   const detune = centsOffFromPitch(frecuency, pitch);

// //   console.log({note, clarity});

// //   if (clarity <= 0.95) {
// //     if (clarity >= 0.85) {
// //       setNotification(true);
// //     } else setNotification(true);
// //     return;
// //   }

// //   setNotification(false);
// //   setFrecuency(~~frecuency);
// //   setNote(note);
// //   setDetune(detune);
// //   setPitch(pitch);

// //   if (savedPitch === undefined) savedPitch = pitch;
// //   else {
// //     if (condition?.(pitch) || (savedPitch === pitch && pitch === target)) {
// //       if (!remainingTries) {
// //         clearInterval(interval);
// //         return setCorrect(true);
// //       }
// //       console.log({remainingTries});
// //       remainingTries--;
// //     } else {
// //       savedPitch = pitch;
// //       remainingTries = initialTries;
// //     }
// //   }
// // };
