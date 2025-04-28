import { subMinutes } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

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
  const zonedTime = toZonedTime(new Date(time), 'Asia/Kolkata');
  const adjustedTime = subMinutes(zonedTime, 22);
  
  return fromZonedTime(adjustedTime, 'Asia/Kolkata');
};
