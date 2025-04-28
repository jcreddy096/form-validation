
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 

import FieldDialog from '../components/FieldDialog';
import SortableFields from '../components/SortableField';
import { FieldType, FormType } from '../types/form';

const FormPage = () => {
  const [formTitle, setFormTitle] = useState('');
  const [formPath, setFormPath] = useState('');
  const [fields, setFields] = useState<FormType[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentField, setCurrentField] = useState<Partial<FormType>>({ type: 'text', required: false });
  const [error, setError] = useState('');
  const navigate = useNavigate(); 
 
  const FormTypes: FieldType[] = [
    'text', 'number', 'email', 'password',
    'date', 'switch', 'chips', 'checkbox', 'radio', 'select'
  ];
  
  

  const handleAddField = () => {
    if (!currentField.type || !currentField.label) return;
    const newField: FormType = {
      id: uuidv4(),
      type: currentField.type,
      label: currentField.label,
      required: currentField.required || false,
      options: currentField.options,
      minLength: currentField.minLength,
      maxLength: currentField.maxLength,
      title: '',
      formId: '',
      fields: [],
      path: '',
      createdAt: ''
    };
    setFields([...fields, newField]);
    setOpenDialog(false);
    setCurrentField({ type: 'text', required: false });
  };

  const handleSaveForm = () => {
    if (!formTitle.trim() || !formPath.trim()) {
      setError('Form Title and Path are required');
      return;
    }
    const existingForms = JSON.parse(localStorage.getItem('forms') || '[]');
    if (existingForms.some((form: { path: string; }) => form.path === formPath)) {
      setError('Form path must be unique');
      return;
    }
    const formConfig = {
      id: uuidv4(),
      title: formTitle,
      path: formPath,
      fields,
      createdAt: new Date().toISOString()
    };
    try {
      localStorage.setItem('forms', JSON.stringify([...existingForms, formConfig]));
      alert('Form saved successfully!');
     
      navigate(`/form-details`); 
    } catch  {
      setError('Failed to save form');
    }
  };

  return (
    
    <Box 
    sx={{ 
      height: '100vh',
      width: '100vw', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f5f5f5',
      py: 30, 
      overflowY: 'auto'  
    }}
  >
    <Paper 
      elevation={6}
      sx={{ 
        p: 6, 
        maxWidth: 600, 
        width: '100%', 
        borderRadius: 4, 
        boxShadow: 3,
        backgroundColor: '#ffffff'
      }}
    >
      <Typography variant="h4" gutterBottom>Form Builder</Typography>

      <TextField
        fullWidth
        label="Form Title"
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Form Path"
        value={formPath}
        onChange={(e) => setFormPath(e.target.value)}
        sx={{ mb: 4 }}
      />

      <Button variant="contained" onClick={() => setOpenDialog(true)}>+ Add Field</Button>

      <Box sx={{ mt: 2 }}>
        <SortableFields
          items={fields}
          onDragEnd={(newFields) => setFields(newFields as FormType[])}
          renderItem={(field) => (
            <Box>{field.label}</Box>
          )}
        />
      </Box>

      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

      <Button
        variant="contained"
        color="success"
        sx={{ mt: 4 }}
        onClick={handleSaveForm}
      >
        Save Form
      </Button>

      <FieldDialog
        open={openDialog}
        fieldTypes={FormTypes}
        currentField={currentField}
        onClose={() => setOpenDialog(false)}
        onChange={setCurrentField}
        onAdd={handleAddField}
      />
      </Paper>
    </Box>
  );
};

export default  FormPage;
