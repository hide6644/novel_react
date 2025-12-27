import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Typography
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import FormTextField from '../components/common/FormTextField';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const { t } = useTranslation();

    const schema = z.object({
        username: z.string().min(1, t('validate.required')),
        password: z.string().min(1, t('validate.required'))
    });

    const { control, handleSubmit, formState: { isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { username: '', password: '' }
    });

    const onSubmit = async (data) => {
        try {
            await login(data.username, data.password);
            navigate('/');
        } catch (err) {
            if (err.response && err.response.status === 403 && err.response.data === "Password expired") {
                navigate('/change-password', { state: { username: data.username } });
                return;
            }
            setError(t('auth.login.failed'));
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', mt: -5 }}>
            <Card sx={{ width: '100%', maxWidth: 400, p: 2 }}>
                <CardContent>
                    <Typography variant="h4" component="h2" align="center" gutterBottom>
                        {t('common.welcome.back')}
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <FormTextField
                            name="username"
                            control={control}
                            margin="normal"
                            required
                            fullWidth
                            label={t('user.label.username')}
                            autoFocus
                        />
                        <FormTextField
                            name="password"
                            control={control}
                            margin="normal"
                            required
                            fullWidth
                            label={t('user.label.password')}
                            type="password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 3, mb: 2 }}
                            loading={isSubmitting}
                        >
                            {t('auth.btn.login')}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Login;
