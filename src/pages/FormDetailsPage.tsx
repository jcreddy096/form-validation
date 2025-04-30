
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { getForms } from '../utils/storage';
import {  FormType} from '../types/form';
import EditIcon from '@mui/icons-material/Edit';


const FormDetailsPage = () => {
  const [forms, setForms] = useState<FormType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = () => {
    setLoading(true);
    try {
      const savedForms = getForms();
      setForms(savedForms);
    } catch (error) {
      console.error('Error loading forms:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography sx={{ p: 4 }}>Loading forms...</Typography>;
  }

  return (
    
        <Box 
        sx={{ 
          height: '130vh',
          width: '100vw', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: '#f5f5f5' 
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
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Saved Forms
      </Typography>

      

      {forms.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No forms found.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 550 }}>
            <TableHead>
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>Form Title</TableCell>
                <TableCell>Path</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {forms.map((form, index) => (
                <TableRow key={form.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{form.title}</TableCell>
                  
                  <TableCell>
                  <Button
  component={Link}
  to={`/${form.path}`}  
  size="small"
  sx={{ textTransform: 'none' }}
>
  {form.path}
</Button>
                  </TableCell>
                  <TableCell>
                  <IconButton
                        component={Link}
                        to={`/edit/${form.id}`}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      </Paper>
    </Box>
  );
};

export default FormDetailsPage;