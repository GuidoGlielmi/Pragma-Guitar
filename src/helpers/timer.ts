import {getSnappedValue} from './pitch';

export function* pollRemainingTime(
  countdownTimeInSeconds: number,
): Generator<number, number, void> {
  const finalTime = new Date(
    new Date().getTime() + Math.max(countdownTimeInSeconds, 1) * 1000,
  ).getTime();
  let currentTime = new Date().getTime();
  while (true) {
    yield finalTime - currentTime;
    currentTime = new Date().getTime();
  }
}

export const simpleDebounce = (fn: () => void, delay = 50): (() => void) => {
  let timer: number | undefined;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
};

export const debounce = <T extends any[]>(
  fn: Task<T, void | (() => void)>,
  delay = 50,
): Task<T, () => void> => {
  let timer: number | undefined;
  return (...args: T) => {
    clearTimeout(timer);
    let cancelCb: void | (() => void);
    timer = setTimeout(() => (cancelCb = fn(...args)), delay);
    return () => {
      cancelCb?.();
      clearTimeout(timer);
    };
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

const HOLD_TIME = 25;

export function setPreciseInterval(task: () => void, msInterval: number = 0) {
  if (~~msInterval <= 9) throw new Error('msInterval should be more than 10ms');
  const interval: {id?: number} = {};
  task();
  let targetTime = performance.now() + msInterval;
  const poll = () => {
    if (performance.now() < targetTime - HOLD_TIME) return;
    clearInterval(interval.id);
    while (performance.now() < targetTime);

    task();
    targetTime = performance.now() + msInterval;
    interval.id = setInterval(poll);
  };
  interval.id = setInterval(poll);
  return interval;
}

export function controlledPollTask<T extends any[]>(
  msInterval: number,
  task: Task<T>,
): [start: (...args: T) => void, stop: () => void] {
  let interval: number;
  let targetTime: number;
  const poll = (...args: T) => {
    if (performance.now() < targetTime - 5) return;
    clearInterval(interval);
    while (performance.now() < targetTime - 2);
    task(...args);
    targetTime += msInterval;
    interval = setInterval(() => poll(...args));
  };
  return [
    (...args: T) => {
      targetTime = performance.now() + msInterval;
      clearInterval(interval);
      task(...args);
      interval = setInterval(() => poll(...args));
    },
    () => {
      clearInterval(interval);
    },
  ];
}

export function setPreciseTimeout(task: () => void, timeout = 0, fromTime = performance.now()) {
  if (~~timeout <= 9) throw new Error('msInterval should be more than 10ms');

  const targetTime = fromTime + timeout;

  const interval = setInterval(poll);

  function poll() {
    if (performance.now() < targetTime - HOLD_TIME) return;
    clearInterval(interval);
    while (performance.now() < targetTime);
    task();
  }

  return interval;
}

export const bpmToFrecuency = (bpm: number) => (1 / (bpm / 60)) * 1000;

const defaultSubdivision = 2 ** 2;
export const bpmToMs = (bpm: number, denominator: number) =>
  bpmToFrecuency(bpm) * (defaultSubdivision / 2 ** Math.log2(denominator));

export const getTapContext = (snapValue = 5) => {
  let prevTime: number | undefined;
  const values: number[] = [];

  const resetter = simpleDebounce(() => {
    values.length = 0;
    prevTime = undefined;
  }, 3_000);

  return () => {
    resetter();

    const currTime = new Date().getTime();
    if (prevTime === undefined) {
      prevTime = currTime;
      return null;
    }

    const deltaTimeInMinutes = (currTime - prevTime) / 1000 / 60;
    const bpm = 1 / deltaTimeInMinutes;
    const value = getSnappedValue(~~bpm, snapValue);

    prevTime = currTime;
    values.push(value);
    return ~~arrayAvg(values);
  };
};

export const arraySum = (arr: number[]) => arr.reduce((p, c) => p + c, 0);

export const arrayAvg = (arr: number[]) => arraySum(arr) / arr.length;
