
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { getForms } from '../utils/storage';

interface FormConfig {
  id: string;
  title: string;
  path: string;
  createdAt: string;
  fields: any[];
}

export default function FormDetailsPage() {
  const [forms, setForms] = useState<FormConfig[]>([]);
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
    <Box sx={{ p: 4, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Saved Forms
      </Typography>

      

      {forms.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No forms found. Create a new form to get started.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
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
  variant="outlined"
  size="small"
>
  {form.path}
</Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      component={Link}
                      to={`/edit/${form.id}`}
                      variant="outlined"
                      size="small"
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}