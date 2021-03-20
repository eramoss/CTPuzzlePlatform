export class PageRequest {
    start: number = 0
    limit: number = 10000
    search: string = ''
    filter: any = {}
    //andWhere: string = '1=1'
    constructor(filter: any = {}) {
        this.filter = filter;
    }
}

export class PageResponse<T> {
    data: T[]
    constructor(data: T[] = []) {
        this.data = data;
    }
}

