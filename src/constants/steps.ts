import {Step} from 'intro.js';

export const noteGenerator = [
  {
    title: 'NOTE GENERATOR',
    element: '.noteContainer',
    intro:
      "This exercise trains you in pitch recognition.\n It can be used to sing over or in any instrument you want to learn the notes across its entire range. It's perfect for learning how to improvise, and even to free yourself from having to look at the fingerboard.\n The idea is to play the notes displayed on the screen as fast as you can as they appear",
  },
  {
    title: 'Toggle On/Off',
    element: '#start',
    intro: 'You can start your timer here',
    // position: 'right',
  },
  {
    element: '#rangeSelector',
    title: 'Note Range',
    intro:
      'In this section, you can select the interval between which the notes are going to appear',
    // hintPosition: 'middle-middle',
    // intro: 'test 2',
  },
  {
    title: 'Free Mode',
    element: '#FreeMode',
    intro: 'This is the mode with less restrictions',
  },
  {
    title: 'Any Octave',
    element: '#any',
    intro: 'Enabling this option you can play the note regardless of its octave',
  },
  {
    title: 'Exact Note',
    element: '#exact',
    intro: 'With this, you have to play the exact note AND octave',
  },
  {
    title: 'Notes of a String',
    element: '#OnString',
    intro:
      'You can select any note from C0 to C8 to represent a string that will cover two whole octaves. For example, if you select E2, the range will go from E2 to E4',
  },
  {
    title: 'Custom Interval',
    element: '#OnNoteRange',
    intro: 'Or you can select any custom interval you desire',
  },
  {
    title: 'Countdown',
    element: '.timerContainer',
    intro:
      'In this section, you will see a countdown showing the time you have left to play the right note. You can choose any value you want, from 1 to 60 seconds',
  },
  {
    title: 'Subtract one Second',
    element: '#minus',
    intro: 'You can subtract seconds one by one...',
  },
  {
    title: 'Add one Second',
    element: '#plus',
    intro: 'Add them one by one...',
  },
  {
    title: 'Enter any value',
    element: '#updateFrecuency',
    intro: 'Or enter any value in this box',
  },
  {
    title: "Up and at 'em!",
    element: '#start',
    intro: 'Now let\'s do a little demonstration by pressing the "Start" button...',
    click: true,
  },
  {
    title: 'Your Note to Play',
    element: '.noteToPlay',
    intro:
      'This box will show you the generated note for you to play. You can also press it to hear what it sounds like',
  },
  {
    title: 'Note you Played',
    element: '.notePlayedContainer',
    intro:
      'And this box shows you what you are playing. \n Come on! whistle a little to see how it goes...',
  },
] as StepWithAction[];
