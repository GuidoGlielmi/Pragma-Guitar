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

export const debounce = <T extends (...args: any) => void | (() => void)>(
  fn: T,
  delay = 50,
): ((...args: Parameters<T>) => () => void) => {
  let timer: number | undefined;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    let cancelCb: void | (() => void);
    timer = setTimeout(() => (cancelCb = fn(args)), delay);
    return () => {
      cancelCb?.();
      clearTimeout(timer);
    };
  };
};

export const throttle = <T extends (...args: any) => void>(fn: T, delay = 50): T => {
  let timer: number | undefined;
  return ((...args: Parameters<T>) => {
    if (timer !== undefined) return;
    timer = setTimeout(() => {
      timer = undefined;
      fn(args);
    }, delay);
  }) as T;
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
  return () => {
    clearInterval(interval);
  };
}

export function controlledPollTask<T extends (...args: any) => void>(
  msInterval: number,
  task: T,
): [start: (...args: Parameters<T>) => void, stop: () => void] {
  let interval: number;
  let targetTime: number;
  const poll = (...args: Parameters<T>) => {
    if (performance.now() < targetTime - 5) return;
    clearInterval(interval);
    while (performance.now() < targetTime - 2);
    task(args);
    targetTime += msInterval;
    interval = setInterval(() => poll(...args));
  };
  return [
    (...args: Parameters<T>) => {
      targetTime = performance.now() + msInterval;
      clearInterval(interval);
      task(args);
      interval = setInterval(() => poll(...args));
    },
    () => {
      clearInterval(interval);
    },
  ];
}
