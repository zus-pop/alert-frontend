import { Subject } from './subjectApi';
import { Combo } from './comboApi';

export interface Curriculum {
  _id: string;
  curriculumName: string;
  comboId: string | Combo;
  subjects?: Subject[];
  updatedAt?: string;
}

export interface CurriculumCreateParams {
  curriculumName: string;
  comboId: string;
  subjectIds: string[];
}

export interface CurriculumUpdateParams {
  curriculumName?: string;
  comboId?: string;
  subjectIds?: string[];
}

export interface CurriculumQueryParams {
  curriculumName?: string;
  comboId?: string;
  order?: string;
  page?: number;
  limit?: number;
}

export interface CurriculumResponse {
  data: Curriculum[];
  totalItems: number;
  totalPage: number;
}
