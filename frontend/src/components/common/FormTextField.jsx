import { Controller } from 'react-hook-form';
import { TextField } from '@mui/material';

const FormTextField = ({ name, control, rules, ...props }) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState: { error } }) => (
                <TextField
                    {...field}
                    {...props}
                    error={!!error}
                    helperText={error ? error.message : props.helperText}
                    value={field.value ?? ''} // Ensure controlled component
                />
            )}
        />
    );
};

export default FormTextField;
