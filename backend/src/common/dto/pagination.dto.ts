/**
 * DTO untuk pagination parameters
 */

export class PaginationDto {
  page: number;
  limit: number;

  constructor(page: number = 1, limit: number = 10) {
    this.page = page > 0 ? page : 1;
    this.limit = limit > 0 && limit <= 100 ? limit : 10;
  }

  get offset(): number {
    return (this.page - 1) * this.limit;
  }
}
