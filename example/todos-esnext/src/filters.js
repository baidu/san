import moment from 'moment';

export const formatDate = (value, format) => {
    let time = moment(value).format(format);
    return  time ? time : '';
};

export const formatHour = hour => {
    hour = hour || 0;
    return (hour % 12 || 12) + ':00 ' + ( hour < 12 ? 'am' : 'pm');
};