import moment from 'moment';
export class DateFormat {

    format(date: Date): string {
        return moment(date).format('DD/MM/YYYY HH:mm:ss')
    }
}