export function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export function addMsToDate(date: Date, ms: number) {
  return new Date(date.valueOf() + ms);
}
export function msBetween(date1: Date, date2: Date): number {
  return Math.round(date2.valueOf() - date1.valueOf());
}
