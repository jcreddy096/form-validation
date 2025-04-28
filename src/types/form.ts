
export type FieldType = 
  | 'text' | 'email' | 'password' | 'number' 
  | 'date' | 'switch' | 'chips' | 'checkbox' 
  | 'radio' | 'select';

export interface FormType {
  type?: FieldType;
  label?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  enableTime?: boolean;
  variant?: string;
  options?: string[];
}

export interface FormConfig {
  id: string;
  title: string;
  path: string;
  fields: FormType[];
  createdAt: string;
}




export const getForms = (): FormConfig[] => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('forms') || '[]');
  };
  
  export const saveForms = (forms: FormConfig[]) => {
    localStorage.setItem('forms', JSON.stringify(forms));
  };