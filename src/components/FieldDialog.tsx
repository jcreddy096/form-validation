
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    FormControl, InputLabel, Select, MenuItem,
    TextField, Checkbox, FormControlLabel, Button, Box
} from '@mui/material';
import { FieldType, FieldConfigType } from '../types/form';

type FieldDialogProps = {
    open: boolean;
    fieldTypes: FieldType[];
    currentField: Partial<FieldConfigType>;
    onClose: () => void;
    onChange: (field: Partial<FieldConfigType>) => void;
    onAdd: () => void;
    onSave: (field: FieldConfigType) => void;
}

const FieldDialog = ({
    open, fieldTypes, currentField, onClose, onChange, onSave
}: FieldDialogProps) => {

    const handleOptionChange = (index: number, value: string) => {
        const updatedOptions = [...(currentField.options || [])];
        updatedOptions[index] = value;
        onChange({ ...currentField, options: updatedOptions });
    };

    const handleAddOption = () => {
        const updatedOptions = [...(currentField.options || []), ''];
        onChange({ ...currentField, options: updatedOptions });
    };

    const handleSave = () => {
        if (currentField.type && currentField.label) {
          onSave(currentField as FieldConfigType); 
        }
      };
      



    const renderField = () => {
        if (!currentField.type) return null;

        
        const supportsLength = ['text', 'password', 'number'].includes(currentField.type);
        
        return (
            <Box sx={{ my: 2 }}>
             
                {supportsLength && (
                    <>
                        <TextField
                            fullWidth
                            label="Min Length"
                            type="number"
                            value={currentField.minLength || ''}
                            onChange={(e) => onChange({ ...currentField, minLength: e.target.value ? parseInt(e.target.value) : undefined })}
                            sx={{ mb: 2 }}
                           
                        />
                        <TextField
                            fullWidth
                            label="Max Length"
                            type="number"
                            value={currentField.maxLength || ''}
                            onChange={(e) => onChange({ ...currentField, maxLength: e.target.value ? parseInt(e.target.value) : undefined })}
                            sx={{ mb: 2 }}
                           
                        />
                    </>
                )}

                
                {['radio', 'checkbox', 'select'].includes(currentField.type || '') && (
                    <>
                        {(currentField.options || []).map((option, index) => (
                            <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <TextField
                                    fullWidth
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    label={`Option ${index + 1}`}
                                />
                            </Box>
                        ))}
                        <Box>
                            <Button
                                variant="outlined"
                                onClick={handleAddOption}
                                sx={{ mb: 2 }}
                            >
                                Add Option
                            </Button>
                        </Box>
                    </>
                )}

             
               
            </Box>
        );
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle> Fields</DialogTitle><br />
            <DialogContent sx={{ pt: 2 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Field Type</InputLabel>
                    <Select
                        value={currentField.type || ''}
                        label="Field Type"
                        onChange={(e) => {
                            const newType = e.target.value as FieldType;
                            onChange({
                                ...currentField,
                                type: newType,
                                minLength: undefined,  
                                maxLength: undefined,
                                options: [],
                            
                            });
                        }}
                    >
                        {fieldTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    label="Field Label"
                    value={currentField.label || ''}
                    onChange={(e) => onChange({ ...currentField, label: e.target.value })}
                    sx={{ mb: 2 }}
                />

                {renderField()}

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={currentField.required || false}
                            onChange={(e) => onChange({ ...currentField, required: e.target.checked })}
                        />
                    }
                    label="Required"
                    sx={{ mt: 1 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>Save Field</Button>
            </DialogActions>
        </Dialog>
    );
};

export default  FieldDialog;
