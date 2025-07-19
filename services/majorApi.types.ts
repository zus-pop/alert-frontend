export interface Major {
  _id: string;
  majorCode: string;
  majorName: string;
  updatedAt?: string;
}

export interface MajorCreateParams {
  majorCode: string;
  majorName: string;
}

export interface MajorUpdateParams {
  majorCode?: string;
  majorName?: string;
}

export interface MajorQueryParams {
  majorCode?: string;
  majorName?: string;
  order?: string;
  page?: number;
  limit?: number;
}

export interface MajorResponse {
  data: Major[];
  totalItems: number;
  totalPage: number;
}
