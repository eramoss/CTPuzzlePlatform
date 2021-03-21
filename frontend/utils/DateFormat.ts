import moment from 'moment';
const DEFAULT_FORMAT = 'DD/MM/YYYY HH:mm:ss';
export class DateFormat {

    parse(dateString: string, format: string = DEFAULT_FORMAT): Date {
        return moment(dateString, format).toDate()
    }

    format(date: Date, format: string = DEFAULT_FORMAT): string {
        return moment(date).format(format)
    }
}