/** Get the time difference in seconds between two Dates */
export const secondDifference = (start: Date, stop: Date) => {
  return Math.floor(stop.getTime() - start.getTime() / 1000);
};

/** Convert a number of seconds into a duration in hh:mm:ss */
export const readableDuration = (duration: number): string => {
  const pad = (n: number) => n.toString().padStart(2, "0");

  const secondsRaw = Math.floor(duration % 60);
  const minutesRaw = Math.floor((duration / 60) % 60);
  const hoursRaw = Math.floor((duration / 3600) % 24);

  const seconds = secondsRaw < 0 ? 0 : secondsRaw;
  const minutes = minutesRaw < 0 ? 0 : minutesRaw;
  const hours = minutesRaw < 0 ? 0 : hoursRaw;

  return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
};
