const translationsKeys = {
  Devices: 'Dispositivos',
  Start: 'Empezar',
  Stop: 'Detener',
  'Note Generator': 'Generador de Notas',
  Metronome: 'Metrónomo',
  Tuner: 'Afinador',
  Beat: 'Compás',
  Tap: 'Pulse',
  'Play Note': 'Tocar Nota',
  'Free Mode': 'Modo Libre',
  'In Note Range': 'Sobre Rango',
  'In String': 'Sobre Cuerda',
  'Any Octave': 'Cualquier Octava',
  'Exact Octave': 'Octava Exacta',
  Countdown: 'Conteo',
  'Best Streak': 'Mejor Racha',
  Play: 'Toque',
  'You Played': 'Ha Tocado',
  From: 'Desde',
  To: 'Hasta',
  Frets: 'Trastes',
  'Add Upper String': 'Agregar Cuerda Aguda',
  'Add Lower String': 'Agregar Cuerda Grave',
  Tuning: 'Afinación',
  'Save Tuning': 'Guardar Afinación',
  Name: 'Nombre',
  'Name already in use!': 'El nombre ya está en uso'
};

export type TranslationKeys = keyof typeof translationsKeys;

export const translate = (str: TranslationKeys | string, eng: boolean | null = true) => {
  const translation = translationsKeys[str as TranslationKeys];
  return eng || !translation ? str : translationsKeys[str as TranslationKeys];
};
