export function* pollRemainingTime(countdownTimeInSeconds: number) {
  const finalTime = new Date(
    new Date().getTime() + Math.max(countdownTimeInSeconds, 1) * 1000,
  ).getTime();
  let currentTime = new Date().getTime();
  while (true) {
    yield finalTime - currentTime;
    currentTime = new Date().getTime();
  }
}

export const debounce = <T extends any[]>(fn: Task<T>, delay = 50): Task<T> => {
  let timer: number | undefined;
  return (...args: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const throttle = <T extends any[]>(fn: Task<T>, delay = 50): Task<T> => {
  let timer: number | undefined;
  return (...args: T) => {
    if (timer !== undefined) return;
    timer = setTimeout(() => {
      timer = undefined;
      fn(...args);
    }, delay);
  };
};
