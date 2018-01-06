import moment from 'moment';

export const formatDate = (value, format) => {
    return value instanceof Date
        ? moment(value).format(format)
        : '';
};

export const formatHour = hour => {
    hour = hour || 0;
    return (hour % 12 || 12) + ':00 ' + ( hour < 12 ? 'am' : 'pm');
};