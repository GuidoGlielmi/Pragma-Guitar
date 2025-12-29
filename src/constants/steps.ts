export const noteGenerator = [
  {
    title: 'NOTE GENERATOR',
    element: '.noteContainer',
  },
  {
    title: 'Toggle On/Off',
    element: '#start',
    // position: 'right',
  },
  {
    element: '#rangeSelector',
    title: 'Note Range',
    // hintPosition: 'middle-middle',
    // intro: 'test 2',
  },
  {
    title: 'Free Mode',
    element: '#freeMode',
  },
  {
    title: 'Custom Interval',
    element: '#inNoteRange',
    click: true,
    position: 'top',
  },
  {
    title: 'Notes of a String',
    element: '#inString',
    click: true,
    position: 'top',
    // hintPosition: 'top-middle',
  },
  {
    title: 'Countdown',
    element: '#timerContainer',
  },
  {
    title: "Up and at 'em!",
    element: '#start',
    click: true,
  },
  {
    title: 'Your Note to Play',
    element: '#noteToPlay',
    updatable: true,
  },
  {
    title: 'Note you Played',
    element: '.notePlayedContainer',
    updatable: true,
  },
] as StepWithActionAndTranslation[];
