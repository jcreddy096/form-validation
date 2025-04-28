
export type FieldType = 
  | 'text' | 'email' | 'password' | 'number' 
  | 'date' | 'switch' | 'chips' | 'checkbox' 
  | 'radio' | 'select';

  export type FormType = {
    id: string;
    path: string;
    title: string;
    formId: string;
    label: string;
    type: FieldType;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    options?: string[];
    extraFields?: string[];
    fields: FieldConfigType[];
    createdAt: string;
  }
  
  export type FieldConfigType = {
    id: string;
    formId: string;
    label: string;
    type: FieldType;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    options?: string[];
    extraFields?: string[];
    
  }