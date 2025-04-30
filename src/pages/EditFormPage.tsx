
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { getForms, saveForms } from '../utils/storage';
import { FormType, FieldConfigType } from '../types/form';
import FieldEditor from '../components/FieldEditor';

const EditFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<FormType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundForm = getForms().find(f => f.id === id);
    setForm(foundForm || null);
    setLoading(false);
  }, [id]);

  const handleAddField = () => {
    if (!form) return;

    const newField: FieldConfigType = {
      id: `${Math.random()}`,
      formId: form.id,
      type: 'text',
      label: 'New Field',
      required: false,
      minLength: undefined,
      maxLength: undefined,
      options: []
    };

    setForm({
      ...form,
      fields: [...form.fields, newField]
    });
  };

  const handleFieldChange = (index: number, field: Partial<FieldConfigType>) => {
    if (!form) return;

    const updatedFields = [...form.fields];
    updatedFields[index] = { ...updatedFields[index], ...field };

    setForm({
      ...form,
      fields: updatedFields
    });
  };

  const handleAddOption = (fieldIndex: number) => {
    if (!form) return;

    const updatedFields = [...form.fields];
    const options = updatedFields[fieldIndex].options || [];
    options.push('');
    updatedFields[fieldIndex].options = options;

    setForm({
      ...form,
      fields: updatedFields
    });
  };

  const handleOptionChange = (fieldIndex: number, optionIndex: number, value: string) => {
    if (!form) return;

    const updatedFields = [...form.fields];
    const options = [...(updatedFields[fieldIndex].options || [])];
    options[optionIndex] = value;
    updatedFields[fieldIndex].options = options;

    setForm({
      ...form,
      fields: updatedFields
    });
  };

  const handleDeleteOption = (fieldIndex: number, optionIndex: number) => {
    if (!form) return;

    const updatedFields = [...form.fields];
    const options = [...(updatedFields[fieldIndex].options || [])];
    options.splice(optionIndex, 1);
    updatedFields[fieldIndex].options = options;

    setForm({
      ...form,
      fields: updatedFields
    });
  };

  const handleDeleteField = (index: number) => {
    if (!form) return;

    if (window.confirm('Are you sure you want to delete?')) {
      const updatedFields = form.fields.filter((_, i) => i !== index);
      setForm({ ...form, fields: updatedFields });
    }
  };

  const handleSaveForm = () => {
    if (!form) return;

    if (!form.title.trim() || !form.path.trim()) {
      alert('Form title and path are required!');
      return;
    }

    const updatedForms = getForms().map(f => (f.id === form.id ? form : f));
    saveForms(updatedForms);
    alert('Form saved successfully!');
  };

  if (loading) return <Typography sx={{ p: 4 }}>Loading...</Typography>;
  if (!form) return <Typography sx={{ p: 4 }}>Form not found</Typography>;

  return (
    <Box sx={{ py: 10, px: 4, backgroundColor: '#f5f5f5', minHeight: '100vh', width:'100vw', display:'flex', alignItems:'center' }}>
      <Paper sx={{ maxWidth: 800, mx: 'auto', p: 5 }}>
        <Typography variant="h4" gutterBottom>Edit Form</Typography>

        <Box sx={{ mb: 4 }}>
          <TextField
            label="Form Title *"
            value={form.title}
            fullWidth
            required
            sx={{ mb: 2 }}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <TextField
            label="Form Path *"
            value={form.path}
            fullWidth
            required
            disabled
            sx={{ mb: 2 }}
            
          />
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" gutterBottom>
          Form Fields
        </Typography>

        {form.fields.map((field, index) => (
          <FieldEditor
            key={field.id}
            field={field}
            index={index}
            onChange={handleFieldChange}
            onDelete={handleDeleteField}
            onAddOption={handleAddOption}
            onChangeOption={handleOptionChange}
            onDeleteOption={handleDeleteOption}
          />
        ))}

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'space-between' }}>
          <Button
            variant="contained"
            onClick={handleSaveForm}
            disabled={!form.title.trim() || !form.path.trim()}
          >
            Save Form
          </Button>

          <Button
            variant="outlined"
            onClick={handleAddField}
            color="secondary"
            startIcon={<Add />}
          >
            Add Field
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditFormPage;
