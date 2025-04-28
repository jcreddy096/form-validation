
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 

import FieldCard from '../components/FieldCard';
import FieldDialog from '../components/FieldDialog';
import SortableFields from '../components/SortableField';
import { FormType } from '../types/form';

export default function FormBuilder() {
  const [formTitle, setFormTitle] = useState('');
  const [formPath, setFormPath] = useState('');
  const [fields, setFields] = useState<FormType[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentField, setCurrentField] = useState<Partial<FormType>>({ type: 'text', required: false });
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const FormTypes = [
    'Text', 'Number', 'Email', 'Password',
    'Date', 'Switch', 'Chips', 'Checkbox', 'Radio', 'Select'
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
    if (existingForms.some((form: any) => form.path === formPath)) {
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
    } catch (error) {
      setError('Failed to save form');
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, margin: '0 auto' }}>
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

      <Box sx={{ mt: 4 }}>
        <SortableFields
          items={fields}
          onDragEnd={(newFields) => setFields(newFields as FormType[])}
          renderItem={(field) => (
            <FieldCard field={field as FormType} />
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
    </Box>
  );
}
