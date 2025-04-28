import { format, subMinutes } from 'date-fns';

export const formatDate = (date: Date) => {
  return format(new Date(date), 'dd MMMM, yyyy'); 
};

export const formatTime = (time: Date) => {
    return format(new Date(time), 'h:mm aa');
};

export const getMaxStartTime = (time: Date) => {
    return subMinutes(time, 22);
};