export class PageRequest {
    start: number = 0
    limit: number = 20
    search: string = ''
    filter: any = {}
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

