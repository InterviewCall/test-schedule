import { subMinutes } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(date));
};

export const formatTime = (time: Date) => {
  return Intl.DateTimeFormat('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  }).format(new Date(time));
};

export const getMaxStartTime = (time: Date) => {
  // const zonedTime = toZonedTime(new Date(time), 'Asia/Kolkata');
  const adjustedTime = subMinutes(time, 22);
  const maxStartTime = toZonedTime(adjustedTime, 'Asia/Kolkata');

  return Intl.DateTimeFormat('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  }).format(maxStartTime);
};
