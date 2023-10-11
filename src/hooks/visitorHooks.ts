import dayjs from 'dayjs';

export function useMinTime() {
  const minTime =
    dayjs().diff(dayjs().startOf('hour')) >= 30
      ? dayjs().startOf('hour').add(1, 'hour')
      : dayjs().startOf('hour').add(30, 'minute');
  return minTime.toDate();
}
