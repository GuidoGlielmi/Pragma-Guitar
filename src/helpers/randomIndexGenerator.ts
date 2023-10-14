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
