import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { Box, Typography, Paper, Button, TextField } from '@mui/material';
import { getForms } from '../utils/storage'; 

interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
}

interface FormConfig {
  id: string;
  title: string;
  path: string;
  createdAt: string;
  fields: FormField[];
}

export default function PathPage() {
  const { path } = useParams<{ path: string }>(); 
  const [formData, setFormData] = useState<FormConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState<{ [key: string]: string }>({});

  useEffect(() => {

    const loadFormData = () => {
      setLoading(true);
      try {
        
        const forms = getForms();
        const form = forms.find(f => f.path === path);
        setFormData(form || null);
      } catch (error) {
        console.error('Error loading form:', error);
      } finally {
        setLoading(false);
      }
    };

    if (path) {
      loadFormData(); 
    }
  }, [path]);

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldId: string) => {
    setFormValues({
      ...formValues,
      [fieldId]: e.target.value
    });
  };

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
  };

  if (loading) {
    return <Typography sx={{ p: 4 }}>Loading form...</Typography>;
  }

  if (!formData) {
    return <Typography sx={{ p: 4 }}>Form not found for this path.</Typography>;
  }

  return (
    <Box sx={{ p: 4, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Form Details for Path: {formData.path}
      </Typography>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h6">{formData.title}</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Created At: {formData.createdAt}
        </Typography>

        
        <form onSubmit={handleSubmit}>
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Form Fields:</Typography>
            {formData.fields.map((field) => (
              <Box key={field.id} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  type={field.type === 'Number' ? 'number' : 'text'}
                  label={field.label}
                  value={formValues[field.id] || ''}
                  required={field.required}
                  onChange={(e) => handleInputChange(e, field.id)}
                />
              </Box>
            ))}
          </Box>

          
          <Button type="submit" variant="contained" sx={{ mt: 3 }}>
            Submit
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
