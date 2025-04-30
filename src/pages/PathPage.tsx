
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { Box, Typography, Paper, Button, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Switch, Chip, SelectChangeEvent } from '@mui/material';
import { getForms } from '../utils/storage'; 
import { FormType } from '../types/form';



 const PathPage =() => {
  const { path } = useParams<{ path: string }>(); 
  const [formData, setFormData] = useState<FormType | null>(null);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState<{ [key: string]: string | boolean | string[] }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [chipInput, setChipInput] = useState<string>('');  

  useEffect(() => {
    const loadFormData = () => {
      setLoading(true);
      try {
        const forms = getForms();
        const form = forms.find(f => f.path === path);
        setFormData(form || null);
        if (form) {
          const initialValues: { [key: string]: string | boolean | string[] } = {};
          form.fields.forEach(field => {
            switch (field.type) {
              case 'checkbox':
              case 'chips':
                initialValues[field.id] = [];
                break;
              case 'switch':
                initialValues[field.id] = false; // Default for switch
                break;
              default:
                initialValues[field.id] = '';
            }
          });
          setFormValues(initialValues);
        }
        
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement| HTMLTextAreaElement>, fieldId: string) => {
    setFormValues({
      ...formValues,
      [fieldId]: e.target.value
    });
  };

  const handleChipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChipInput(e.target.value);
  };


  const handleAddChip = (fieldId: string) => {
    if (!chipInput.trim()) return;
  
    setFormValues(prev => {
      const current = Array.isArray(prev[fieldId]) ? prev[fieldId] as string[] : [];
      if (current.includes(chipInput)) return prev;
  
      return {
        ...prev,
        [fieldId]: [...current, chipInput],
      };
    });
  
    setChipInput('');
  };
  

  const handleRemoveChip = (fieldId: string, chip: string) => {
    const updatedChips = (formValues[fieldId] as string[]).filter((item) => item !== chip);
    setFormValues({
      ...formValues,
      [fieldId]: updatedChips
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, fieldId: string, option: string) => {
    const updatedValue = formValues[fieldId] as string[] || [];
    if (e.target.checked) {
      updatedValue.push(option);
    } else {
      const indexToRemove = updatedValue.indexOf(option);
      updatedValue.splice(indexToRemove, 1);
    }
    setFormValues({
      ...formValues,
      [fieldId]: updatedValue
    });
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>, fieldId: string) => {
    setFormValues({
      ...formValues,
      [fieldId]: e.target.checked
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<string | boolean | string[]>,fieldId: string) => {
    setFormValues({
      ...formValues,
      [fieldId]: e.target.value ,
    });
  };

  const validateForm = () => {
    const formErrors: { [key: string]: string } = {};

    formData?.fields.forEach((field) => {
      const fieldValue = formValues[field.id];


      if (field.required) {
        const isBooleanField = field.type === 'switch';
        const isEmptyArray = Array.isArray(fieldValue) && fieldValue.length === 0;
        const isEmptyString = typeof fieldValue === 'string' && fieldValue.trim() === '';
  
        if (
          (isBooleanField && typeof fieldValue !== 'boolean') ||
          (!isBooleanField && (fieldValue === undefined || fieldValue === null || isEmptyArray || isEmptyString))
        ) {
          formErrors[field.id] = 'This field is required';
        }
      }
     

    
      if (field.minLength && typeof fieldValue === 'string' && fieldValue.length < field.minLength) {
        formErrors[field.id] = `Minimum length is ${field.minLength}`;
      }

     
      if (field.maxLength && typeof fieldValue === 'string' && fieldValue.length > field.maxLength) {
        formErrors[field.id] = `Maximum length is ${field.maxLength}`;
      }
    });

    return formErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      const submittedData: { [key: string]: string | boolean | string[] } = {};

  formData?.fields.forEach((field) => {
    submittedData[field.label] = formValues[field.id];
  });
  
      console.log('Form Submitted:', submittedData);
      alert('Form submitted successfully!');
    }
  };

  if (loading) {
    return <Typography sx={{ p: 4 }}>Loading form...</Typography>;
  }

  if (!formData) {
    return <Typography sx={{ p: 4 }}>Form not found </Typography>;
  }

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
        maxWidth: 800, 
        width: '100%', 
        borderRadius: 4, 
        boxShadow: 3,
        backgroundColor: '#ffffff'
      }}
    >
        <Typography variant="h3" >{formData.title}</Typography>
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ mt: 3 }}>
            
            {formData.fields.map((field) => {
              switch (field.type) {
                case 'checkbox':
                  return (
                    <Box key={field.id} sx={{ mb: 2 }}>
                      <Typography variant="body1">{field.label}</Typography>
                      {(field.options || []).map((option, index) => (
                        <FormControlLabel
                          key={index}
                          control={
                            <Checkbox
                            checked={Array.isArray(formValues[field.id]) && (formValues[field.id] as string[]).includes(option)}

                              onChange={(e) => handleCheckboxChange(e, field.id, option)}
                              value={option}
                              required={field.required}
                            />
                          }
                          label={option}
                        />
                      ))}
                      {errors[field.id] && <Typography color="error" variant="body2">{errors[field.id]}</Typography>}
                    </Box>
                  );

                case 'switch':
                  return (
                    <Box key={field.id} sx={{ mb: 2 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            ///checked={Boolean(formValues[field.id])}
                            checked={formValues[field.id] === true}
                            onChange={(e) => handleSwitchChange(e, field.id)}
                            required={field.required}
                          />
                        }
                        label={field.label}
                      />
                      {errors[field.id] && <Typography color="error" variant="body2">{errors[field.id]}</Typography>}
                    </Box>
                  );

                case 'select':
                  return (
                    <Box key={field.id} sx={{ mb: 2 }}>
                     
                      <FormControl fullWidth required={field.required}>
                        <InputLabel>{field.label}</InputLabel>
                        <Select
                          value={formValues[field.id] || ''}
                          onChange={(e) => handleSelectChange(e, field.id)}
                        >
                          {(field.options || []).map((option, index) => (
                            <MenuItem key={index} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {errors[field.id] && <Typography color="error" variant="body2">{errors[field.id]}</Typography>}
                    </Box>
                  );

                  case 'radio':
                    return (
                      <Box key={field.id} sx={{ mb: 2 }}>
                        <Typography variant="body1">{field.label}</Typography>
                        {(field.options || []).map((option, index) => (
                          <FormControlLabel
                            key={index}
                            control={
                              <Checkbox
                                checked={formValues[field.id] === option}
                                onChange={(e) => handleInputChange(e, field.id)}
                                value={option}
                              />
                            }
                            label={option}
                          />
                        ))}
                      </Box>
                    );
  


                case 'chips':
                  return (
                    <Box key={field.id} sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        type="text"
                        label={field.label}
                        value={chipInput}
                        onChange={handleChipChange}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddChip(field.id);
                          }
                        }}
                        
                      />
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1 }}>
                        {(formValues[field.id] as string[] || []).map((chip, index) => (
                          <Chip
                            key={index}
                            label={chip}
                            onDelete={() => handleRemoveChip(field.id, chip)}
                            sx={{ margin: '4px' }}
                          />
                        ))}
                      </Box>
                      {errors[field.id] && <Typography color="error" variant="body2">{errors[field.id]}</Typography>}
                    </Box>
                  );

                case 'text':
                case 'email':
                case 'password':
                case 'number':
                
                  return (
                    <Box key={field.id} sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        type={field.type}
                        label={field.label}
                        value={formValues[field.id] || ''}
                        required={field.required}
                        onChange={(e) => handleInputChange(e, field.id)}
                       
                        error={!!errors[field.id]}
                        helperText={errors[field.id]}
                      />
                    </Box>
                  );

                  case 'date':
                  return (
                    <Box key={field.id} sx={{ mb: 2 }}>
                    
                      <Typography variant="body1">{field.label}</Typography>
                      <TextField
                        fullWidth
                        type={field.type}

                        value={formValues[field.id] || ''}
                        required={field.required}
                        onChange={(e) => handleInputChange(e, field.id)}
                       
                        error={!!errors[field.id]}
                        helperText={errors[field.id]}
                      />
                    </Box>
                  );

                default:
                  return null;
              }
            })}
          </Box>

          <Button type="submit" variant="contained" sx={{ mt: 3 }}>
            Submit
          </Button>
        </form>
      </Paper>
    </Box>
  );
};
export default  PathPage;





