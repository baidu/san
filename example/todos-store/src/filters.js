import moment from 'moment'

export const formatDate = (value, format) => {
    return moment(value).format(format)
}
