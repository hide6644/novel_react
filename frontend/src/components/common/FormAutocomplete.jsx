import { Controller } from 'react-hook-form';
import { Autocomplete, TextField } from '@mui/material';

const FormAutocomplete = ({
    name,
    control,
    options,
    label,
    getOptionLabel = (option) => option.name || '',
    isOptionEqualToValue = (option, value) => option.id === value?.id,
    ...props
}) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <Autocomplete
                    {...props}
                    options={options}
                    getOptionLabel={getOptionLabel}
                    // Find the object in options that matches the current field value (ID)
                    value={options.find(option => option.id === field.value) || null}
                    onChange={(event, newValue) => {
                        field.onChange(newValue ? newValue.id : '');
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={label}
                            margin="dense"
                            variant="outlined"
                            error={!!error}
                            helperText={error ? error.message : null}
                        />
                    )}
                />
            )}
        />
    );
};

export default FormAutocomplete;
