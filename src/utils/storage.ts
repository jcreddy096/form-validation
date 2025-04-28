
import type { FormConfig } from '../types/form'; 

const FORM_STORAGE_KEY = 'forms';

export const getForms = (): FormConfig[] => {
  try {
    return JSON.parse(localStorage.getItem(FORM_STORAGE_KEY) || '[]');
  } catch (error) {
    console.error('Error loading forms:', error);
    return [];
  }
};

export const saveForms = (forms: FormConfig[]): void => {
  localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(forms));
};
