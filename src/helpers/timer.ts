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

export const debounce = <T extends any[]>(fn: Task<T>, delay = 50): Task<T, () => void> => {
  let timer: number | undefined;
  return (...args: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
    return () => clearTimeout(timer);
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

export function pollTask(msInterval: number, task: () => void) {
  let interval: number;
  task();
  let targetTime = performance.now() + msInterval;
  const poll = () => {
    if (performance.now() < targetTime - 5) return;
    clearInterval(interval);
    while (performance.now() < targetTime - 2);
    task();
    targetTime += msInterval;
    interval = setInterval(poll);
  };
  interval = setInterval(poll);
  return () => clearInterval(interval);
}
