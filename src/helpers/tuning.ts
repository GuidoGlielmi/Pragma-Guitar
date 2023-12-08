export const getRandomIndexGenerator = (from: number, to: number, initialValue?: number) => {
  const getRandomIndex = () => ~~(Math.random() * (to - from)) + from;
  let prevValue = initialValue;

  return () => {
    let newValue: number;
    newValue = getRandomIndex();
    while (newValue === prevValue) newValue = getRandomIndex();
    prevValue = newValue;
    return newValue;
  };
};

export const generateRandomIndex = (from: number, to: number) =>
  ~~(Math.random() * (to - from)) + from;

export const getLowestPitch = (t: ITuningState) =>
  t.strings.reduce((p, c) => Math.min(p, c.pitch), Infinity);

export const getHighestPitch = (t: ITuningState) =>
  t.strings.reduce((p, c) => Math.max(p, c.pitch), -Infinity);
