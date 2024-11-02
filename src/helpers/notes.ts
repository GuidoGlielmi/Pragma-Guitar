export const convertTuningToState = (t: ITuning | IPersistedTuning): ITuningState => ({
  ...t,
  deletable: !(t as any).deletable ?? true,
  strings: t.strings.map((v, i) => ({
    id: Math.random(),
    originalIndex: i,
    originalPitch: v,
    pitch: v,
  })),
});

export const convertStateToTuning = (t: ITuningState): ITuning => ({
  ...t,
  strings: t.strings.map(p => p.pitch),
});

export const createTuning = (label: string, pitches: StringStateValue[]): ITuning => ({
  label,
  strings: pitches.map(p => p.pitch),
  deletable: true,
});

export const createString = (pitch: number): StringStateValue => ({
  id: Math.random(),
  originalPitch: null,
  pitch,
});
