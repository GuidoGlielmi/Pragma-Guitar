export const cancelableThrottle = (fn: () => any, delay = 50): ((cancel?: boolean) => any) => {
  let timer: number;

  return (cancel = false) => {
    if (cancel) return clearTimeout(timer);
    if (timer === undefined) timer = setTimeout(fn, delay);
  };
};
