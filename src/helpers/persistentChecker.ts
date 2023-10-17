export const persistentChecker = (
  fn: (...args: any[]) => any,
  condition: (...args: any[]) => boolean,
  onSuccess: (...args: any[]) => any,
  tries = 3,
): (() => any) => {
  let remainingTries = tries;
  return async (...newValues: any[]) => {
    const result = await fn(...newValues);
    const positiveOutcome = condition(result);
    if (positiveOutcome) {
      if (!remainingTries) {
        return onSuccess(result);
      }
      remainingTries--;
    } else remainingTries = tries;
  };
};
