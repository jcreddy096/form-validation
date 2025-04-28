
import type { FormType } from '../types/form'; 

const FORM_STORAGE_KEY = 'forms';

export const getForms = (): FormType[] => {
  if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(FORM_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const saveForms = (forms: FormType[]): void => {
  localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(forms));
};
