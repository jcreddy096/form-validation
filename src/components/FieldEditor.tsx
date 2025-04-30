import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Button,
} from '@mui/material';
import { Add, Delete, RemoveCircleOutline } from '@mui/icons-material';
import { FieldConfigType, FieldType } from '../types/form';

const fieldTypes: FieldType[] = [
  'text', 'email', 'password', 'number', 'date',
  'switch', 'checkbox', 'radio', 'select', 'chips'
];

type FieldEditorProps = {
  field: FieldConfigType;
  index: number;
  onChange: (index: number, field: Partial<FieldConfigType>) => void;
  onDelete: (index: number) => void;
  onAddOption: (fieldIndex: number) => void;
  onChangeOption: (fieldIndex: number, optionIndex: number, value: string) => void;
  onDeleteOption: (fieldIndex: number, optionIndex: number) => void;
};

const FieldEditor = ({
  field,
  index,
  onChange,
  onDelete,
  onAddOption,
  onChangeOption,
  onDeleteOption,
}: FieldEditorProps) => {
  return (
    

    <Box
  sx={{
    mb: 3,
    p: 2,
    borderRadius: 2,
    boxShadow: 3,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  }}>
      <TextField
        label="Field Label"
        value={field.label}
        fullWidth
        sx={{ flex: '1 1 100%' }}
        onChange={(e) => onChange(index, { label: e.target.value })}
      />

      <FormControl sx={{ flex: 1 }}>
        <InputLabel>Type</InputLabel>
        <Select
          value={field.type}
          label="Type"
          onChange={(e) =>
            onChange(index, {
              type: e.target.value as FieldType,
              options: ['select', 'radio', 'checkbox', 'chips'].includes(e.target.value)
                ? field.options
                : []
            })
          }
        >
          {fieldTypes.map((type) => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Checkbox
            checked={field.required}
            onChange={(e) => onChange(index, { required: e.target.checked })}
          />
        }
        label="Required"
      />

      {['text', 'email', 'password', 'number'].includes(field.type) && (
        <>
          <TextField
            label="Min Length"
            type="number"
            value={field.minLength || ''}
            sx={{ width: 120 }}
            onChange={(e) =>
              onChange(index, {
                minLength: e.target.value ? parseInt(e.target.value) : undefined
              })
            }
          />
          <TextField
            label="Max Length"
            type="number"
            value={field.maxLength || ''}
            sx={{ width: 120 }}
            onChange={(e) =>
              onChange(index, {
                maxLength: e.target.value ? parseInt(e.target.value) : undefined
              })
            }
          />
        </>
      )}

      

      {['select', 'radio', 'chips'].includes(field.type) && (
        <Box sx={{ flex: '1 1 100%', mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Options:
          </Typography>
          <Stack spacing={1}>
            {(field.options || []).map((option, optionIndex) => (
              <Box key={optionIndex} sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  value={option}
                  fullWidth
                  size="small"
                  onChange={(e) => onChangeOption(index, optionIndex, e.target.value)}
                />
                <IconButton
                  size="small"
                  onClick={() => onDeleteOption(index, optionIndex)}
                  color="error"
                >
                  <RemoveCircleOutline />
                </IconButton>
              </Box>
            ))}
          </Stack>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Add />}
            onClick={() => onAddOption(index)}
            sx={{ mt: 1 }}
          >
            Add Option
          </Button>
        </Box>
      )}

      <IconButton
        onClick={() => onDelete(index)}
        color="error"
        sx={{ ml: 'auto' }}
      >
        <Delete />
      </IconButton>
    </Box>
  );
};

export default FieldEditor;
