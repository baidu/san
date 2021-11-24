import moment from 'moment'

export function formatDate(value: string, format: string) {
    let time = moment(value).format(format);
    return  time ? time : '';
}

export function formatHour(hour: number) {
    hour = hour || 0;
    return (hour % 12 || 12) + ':00 ' + ( hour < 12 ? 'am' : 'pm');
}