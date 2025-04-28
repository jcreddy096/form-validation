

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import { getForms, saveForms } from '../utils/storage'; 
import { FormConfig } from '../types/form';

export default function EditFormPage() {
  const { id } = useParams<{ id: string }>(); 
  const [form, setForm] = useState<FormConfig | null>(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (id) {
      const foundForm = getForms().find(f => f.id === id);
      setForm(foundForm || null);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <Typography sx={{ p: 4 }}>Loading form...</Typography>;
  }

  if (!form) {
    return <Typography sx={{ p: 4 }}>Form not found.</Typography>;
  }

  const handleFieldChange = (index: number, key: keyof FormField, value: string | number | boolean) => {
    const updatedFields = [...form.fields];
    updatedFields[index] = { ...updatedFields[index], [key]: value };
    setForm({ ...form, fields: updatedFields });
  };

  const handleSave = () => {
    const savedForms = getForms();
    const updatedForms = savedForms.map((f) => (f.id === form.id ? form : f));
    saveForms(updatedForms);
    alert('Form updated successfully!');
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>Edit Form</Typography>

      <TextField
        label="Form Title"
        value={form.title}
        fullWidth
        margin="normal"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <TextField
        label="Form Path"
        value={form.path}
        fullWidth
        margin="normal"
        InputProps={{ readOnly: true }}
      />

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Fields</Typography>

      {form.fields.map((field, index) => (
        <Box key={field.id} sx={{ mb: 3 }}>
          <TextField
            label="Field Label"
            value={field.label}
            fullWidth
            margin="normal"
            onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
          />

          <TextField
            label="Field Type"
            value={field.type}
            fullWidth
            margin="normal"
            InputProps={{ readOnly: true }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={field.required}
                onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
              />
            }
            label="Required"
          />
        </Box>
      ))}

      <Button variant="contained" onClick={handleSave}>
        Save Changes
      </Button>
    </Box>
  );
}