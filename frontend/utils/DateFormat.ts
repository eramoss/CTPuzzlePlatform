import moment from 'moment';
const DEFAULT_FORMAT = 'DD/MM/YYYY HH:mm:ss';
export class DateFormat {

    constructor(){
        moment.locale('pt-BR');
    }

    parse(dateString: string, format: string = DEFAULT_FORMAT): Date {
        return moment(dateString, format).toDate()
    }

    format(date: Date, format: string = DEFAULT_FORMAT): string {
        return this.fromNow(date);
        //return moment(date).format(format)
    }

    fromNow(date: Date): string {
        return moment(date).fromNow()
    }
}