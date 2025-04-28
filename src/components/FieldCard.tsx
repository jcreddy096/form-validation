import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { FormType } from '../types/form';

interface FieldCardProps {
  field: FormType;
}

export default function FieldCard({ field }: FieldCardProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6">{field.label}</Typography>
          <Chip label={field.type} color="primary" size="small" variant="outlined" />
          {field.required && (
            <Chip label="Required" color="error" size="small" variant="outlined" />
          )}
        </Box>

        {field.options && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>Options:</strong> {field.options.join(', ')}
          </Typography>
        )}

        {(field.minLength || field.maxLength) && (
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {field.minLength && <span>Min: {field.minLength} </span>}
            {field.maxLength && <span>Max: {field.maxLength}</span>}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
