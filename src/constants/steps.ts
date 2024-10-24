import {MAX_COUNTDOWN_VALUE} from '.';

export const noteGenerator = [
  {
    title: 'NOTE GENERATOR',
    element: '.noteContainer',
    intro: {
      en: "This exercise trains you in pitch recognition.\n It can be used to sing over or in any instrument you want to learn the notes across its entire range. It's perfect for learning how to improvise, and even free yourself from even having to look at the fingerboard.\n The idea is to play the notes displayed on the screen as fast as you can as they appear",
      es: 'Este ejercicio entrena en el reconocimiento de tonos.\n Se puede utilizar para el canto o sobre cualquier instrumento en el que desees aprender a hallar sus notas. Es perfecto para aprender a improvisar, e incluso liberarte de tener que mirar el diapasón.\n La idea es tocar las notas que se muestran en pantalla lo más rápido que puedas a medida que aparecen.',
    },
  },
  {
    title: 'Toggle On/Off',
    element: '#start',
    intro: {en: 'You can start your timer here', es: 'Comience el conteo aquí'},
    // position: 'right',
  },
  {
    element: '#rangeSelector',
    title: 'Note Range',
    intro: {
      en: 'In this section, you can select the interval between which the notes are going to appear',
      es: 'En esta sección puede seleccionar el intervalo dentro del cual las notas se generarán',
    },
    // hintPosition: 'middle-middle',
    // intro: 'test 2',
  },
  {
    title: 'Free Mode',
    element: '#freeMode',
    intro: {
      en: 'You can play the note regardless of its octave',
      es: 'Toque las notas sin tener en cuenta su octava',
    },
  },
  {
    title: 'Custom Interval',
    element: '#inNoteRange',
    intro: {en: 'Or select any custom interval you desire', es: 'O seleccione un intervalo'},
    click: true,
    position: 'top',
  },
  {
    title: 'Notes of a String',
    element: '#inString',
    intro: {
      en: 'Here you can select, customize and save tunings, starting from a list of the most common ones',
      es: 'Aquí puede seleccionar, modificar y guardar tonalidades, con una lista de las más comunes a su disposición',
    },
    click: true,
    position: 'top',
    // hintPosition: 'top-middle',
  },
  {
    title: 'Countdown',
    element: '#timerContainer',
    intro: {
      en: `In this section, you will see a countdown showing the time you have left to play the right note. You can choose any value you want, from 1 to ${MAX_COUNTDOWN_VALUE} seconds`,
      es: `En esta sección, verá una cuenta regresiva que muestra el tiempo restante para tocar la nota correcta. Puede elegir cualquier valor, de 1 a ${MAX_COUNTDOWN_VALUE} segundos`,
    },
  },
  {
    title: "Up and at 'em!",
    element: '#start',
    intro: {
      en: 'Now let\'s do a little demonstration by pressing the "Start" button...',
      es: 'Hagamos una pequeña demostración presionando el botón "Comenzar"...',
    },
    click: true,
  },
  {
    title: 'Your Note to Play',
    element: '#noteToPlay',
    intro: {
      en: 'This box will show you the generated note for you to play. You can also press it to hear what it sounds like',
      es: 'Este cuadro le mostrará la nota que deberá tocar. También puede presionarlo para escuchar cómo suena',
    },
    updatable: true,
  },
  {
    title: 'Note you Played',
    element: '.notePlayedContainer',
    intro: {
      en: 'And this box shows you what you are playing. \n Come on! whistle a little to see how it goes...',
      es: 'Y este cuadro te muestra lo que estás jugando. \n¡Vamos! silba un poco a ver como va...',
    },
    updatable: true,
  },
] as StepWithActionAndTranslation[];
