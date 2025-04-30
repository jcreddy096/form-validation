import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { FieldConfigType } from '../types/form';

type FieldCardProps = {
  field: FieldConfigType;
  index: number;
  onChange: (index: number, key: keyof FieldConfigType, value: string | number | boolean | string[] | undefined) => void;
  onDelete: (index: number) => void;
}
const FieldCard = ({ field }: FieldCardProps) => {
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

       
        {(field.minLength !== undefined || field.maxLength !== undefined) && (
  <Typography variant="body2" sx={{ mt: 0.5 }}>
    {field.minLength !== undefined && <span>Min Length: {field.minLength} </span>}
    {field.maxLength !== undefined && <span>Max Length: {field.maxLength}</span>}
  </Typography>
)}

      </CardContent>
    </Card>
  );
};

export default  FieldCard;
