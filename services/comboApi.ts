import axios from 'axios';
import { api } from './api';

// Types
export interface Combo {
  _id: string;
  comboCode: string;
  comboName: string;
  description: string;
  majorId: {
    _id?: string;
    majorCode: string;
    majorName: string;
  } | string;
  updatedAt?: string;
}

export interface ComboCreateRequest {
  comboCode: string;
  comboName: string;
  description: string;
  majorId: string;
}

export interface ComboUpdateRequest {
  comboCode?: string;
  comboName?: string;
  description?: string;
  majorId?: string;
}

export interface CombosQueryParams {
  page?: number;
  limit?: number;
  comboCode?: string;
  comboName?: string;
  order?: string;
}

export interface CombosResponse {
  data: Combo[];
  totalItems: number;
  totalPage: number;
}

// API Functions
export const getCombos = async (params?: CombosQueryParams): Promise<CombosResponse> => {
  try {
    const response = await api.get('/combos', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching combos:', error);
    throw error;
  }
};

export const getComboById = async (id: string): Promise<Combo> => {
  try {
    const response = await api.get(`/combos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching combo with id ${id}:`, error);
    throw error;
  }
};

export const createCombo = async (data: ComboCreateRequest): Promise<Combo> => {
  try {
    const response = await api.post('/combos', data);
    return response.data;
  } catch (error) {
    console.error('Error creating combo:', error);
    throw error;
  }
};

export const updateCombo = async (id: string, data: ComboUpdateRequest): Promise<Combo> => {
  try {
    const response = await api.patch(`/combos/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating combo with id ${id}:`, error);
    throw error;
  }
};

export const deleteCombo = async (id: string): Promise<void> => {
  try {
    await api.delete(`/combos/${id}`);
  } catch (error) {
    console.error(`Error deleting combo with id ${id}:`, error);
    throw error;
  }
};
