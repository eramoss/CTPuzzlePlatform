export class PageResponse<T> {
  data: T[];

  constructor(data: T[]) {
    this.data = data;
  }
}
