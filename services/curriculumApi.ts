import { api } from './api';
import { 
  Curriculum, 
  CurriculumCreateParams, 
  CurriculumQueryParams, 
  CurriculumResponse,
  CurriculumUpdateParams 
} from './curriculumApi.types';

export async function getCurriculums(params?: CurriculumQueryParams): Promise<CurriculumResponse> {
  const res = await api.get('/curriculums', { params });
  return res.data;
}

export async function getCurriculum(id: string): Promise<Curriculum> {
  const res = await api.get(`/curriculums/${id}`);
  return res.data;
}

export async function createCurriculum(data: CurriculumCreateParams): Promise<Curriculum> {
  const res = await api.post('/curriculums', data);
  return res.data;
}

export async function updateCurriculum(id: string, data: CurriculumUpdateParams): Promise<Curriculum> {
  const res = await api.patch(`/curriculums/${id}`, data);
  return res.data;
}

export async function deleteCurriculum(id: string): Promise<void> {
  const res = await api.delete(`/curriculums/${id}`);
  return res.data;
} 