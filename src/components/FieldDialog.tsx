
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    FormControl, InputLabel, Select, MenuItem,
    TextField, Checkbox, FormControlLabel, Button, Box, Chip, Stack
} from '@mui/material';
import { FieldType, FormType } from '../types/form';
import { saveForms, getForms } from '../utils/storage';  

interface FieldDialogProps {
    open: boolean;
    fieldTypes: FieldType[];
    currentField: Partial<FormType>;
    onClose: () => void;
    onChange: (field: Partial<FormType>) => void;
    onAdd: () => void;
}

export default function FieldDialog({
    open, fieldTypes, currentField, onClose, onChange, onAdd
}: FieldDialogProps) {

    const handleChipDelete = (chipToDelete: string) => {
        const newOptions = (currentField.options || []).filter(option => option !== chipToDelete);
        onChange({ ...currentField, options: newOptions });
    };

    const handleChipAdd = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && event.currentTarget.value.trim()) {
            const newOption = event.currentTarget.value.trim();
            const newOptions = [...(currentField.options || []), newOption];
            onChange({ ...currentField, options: newOptions });
            event.currentTarget.value = '';  
        }
    };

    const handleAddExtraField = () => {
        const newExtraField = (currentField.extraFields || []);
        newExtraField.push(''); 
        onChange({ ...currentField, extraFields: newExtraField });
    };

    const handleExtraFieldChange = (index: number, value: string) => {
        const newExtraFields = [...(currentField.extraFields || [])];
        newExtraFields[index] = value;
        onChange({ ...currentField, extraFields: newExtraFields });
    };

    const renderFieldConstraints = () => {
        if (!currentField.type) return null;

        switch (currentField.type.toLowerCase()) {
            case 'text':
            case 'password':
                return (
                    <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
                        <TextField
                            fullWidth
                            label="Min Length"
                            type="number"
                            value={currentField.minLength || ''}
                            onChange={(e) => onChange({
                                ...currentField,
                                minLength: Number(e.target.value) || undefined
                            })}
                        />
                        <TextField
                            fullWidth
                            label="Max Length"
                            type="number"
                            value={currentField.maxLength || ''}
                            onChange={(e) => onChange({
                                ...currentField,
                                maxLength: Number(e.target.value) || undefined
                            })}
                        />
                    </Box>
                );

            case 'number':
                return (
                    <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
                        <TextField
                            fullWidth
                            label="Min Value"
                            type="number"
                            value={currentField.min || ''}
                            onChange={(e) => onChange({
                                ...currentField,
                                min: Number(e.target.value) || undefined
                            })}
                        />
                        <TextField
                            fullWidth
                            label="Max Value"
                            type="number"
                            value={currentField.max || ''}
                            onChange={(e) => onChange({
                                ...currentField,
                                max: Number(e.target.value) || undefined
                            })}
                        />
                    </Box>
                );

            case 'checkbox':
            case 'radio':
            case 'select':
                return (
                    <Box sx={{ my: 2 }}>
                        <TextField
                            fullWidth
                            label="Options"
                            sx={{ mb: 1 }}
                            placeholder="Add option and press Enter"
                            onKeyDown={handleChipAdd}
                        />
                        <Stack direction="row" flexWrap="wrap" spacing={1}>
                            {(currentField.options || []).map((option, index) => (
                                <Chip
                                    key={index}
                                    label={option}
                                    onDelete={() => handleChipDelete(option)}
                                />
                            ))}
                        </Stack>

                        <Button variant="outlined" onClick={handleAddExtraField} sx={{ mt: 2 }}>
                            Add Extra Field
                        </Button>

                        {(currentField.extraFields || []).map((extraField, index) => (
                            <TextField
                                key={index}
                                fullWidth
                                label={`Extra Option ${index + 1}`}
                                value={extraField}
                                onChange={(e) => handleExtraFieldChange(index, e.target.value)}
                                sx={{ my: 2 }}
                            />
                        ))}
                    </Box>
                );

            default:
                return null;
        }
    };

    const handleSave = () => {
        // Save the updated form field data to localStorage
        const forms = getForms();
        const updatedForms = forms.map(form => {
            if (form.id === currentField.id) {
                return { ...form, fields: form.fields.map(field => field.id === currentField.id ? { ...field, ...currentField } : field) };
            }
            return form;
        });

        saveForms(updatedForms);  // Update localStorage with the new data
        onAdd();  // Call the onAdd callback
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Configure Field</DialogTitle>
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
                                min: undefined,
                                max: undefined,
                                minLength: undefined,
                                maxLength: undefined,
                                options: undefined,
                                extraFields: []  // Reset extra fields when type changes
                            });
                        }}
                    >
                        {fieldTypes.map((type) => (
                            <MenuItem key={type} value={type.toLowerCase()}>
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

                {renderFieldConstraints()}

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={currentField.required || false}
                            onChange={(e) => onChange({ ...currentField, required: e.target.checked })}
                        />
                    }
                    label="Required Field"
                    sx={{ mt: 1 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>Save Field</Button>
            </DialogActions>
        </Dialog>
    );
}
