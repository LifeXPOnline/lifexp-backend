export class QueryOptions {
  sort?: string; // "title -createdAt"
  limit?: number;
  skip?: number;

  constructor(sort?: string, limit?: number, skip?: number) {
    if (sort) this.sort = sort;
    else this.sort = '+updatedAt';

    if (limit != null) this.limit = limit;
    else this.limit = 20;

    if (skip != null) this.skip = skip; 
    else this.skip = 0;
  }
}

