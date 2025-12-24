import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Button, Typography, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormTextField from '../components/common/FormTextField';
import api from '../api/axios';

const ChangePassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const schema = z.object({
        username: z.string().min(1, t('validate.required')),
        currentPassword: z.string().min(1, t('validate.required')),
        newPassword: z.string().min(4, t('validate.minLength', { min: 4 })).max(100, t('validate.maxLength', { max: 100 })),
        confirmPassword: z.string().min(1, t('validate.required'))
    }).refine((data) => data.newPassword === data.confirmPassword, {
        message: t('error.passwordMismatch'),
        path: ["confirmPassword"],
    });

    const { control, handleSubmit, setValue } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            username: location.state?.username || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    const onSubmit = async (data) => {
        setError('');
        setSuccess('');

        try {
            await api.post('/auth/change-password', {
                username: data.username,
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            });
            setSuccess(t('success.passwordChanged'));
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError(t('error.currentPasswordIncorrect'));
            } else {
                setError(t('error.changePasswordFailed'));
            }
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', mt: -5 }}>
            <Card sx={{ width: '100%', maxWidth: 400, p: 2 }}>
                <CardContent>
                    <Typography variant="h5" component="h2" align="center" gutterBottom>
                        {t('title.changePassword')}
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <FormTextField
                            name="username"
                            control={control}
                            margin="normal"
                            required
                            fullWidth
                            label={t('label.username')}
                            disabled={!!location.state?.username}
                        />
                        <FormTextField
                            name="currentPassword"
                            control={control}
                            margin="normal"
                            required
                            fullWidth
                            label={t('label.currentPassword')}
                            type="password"
                        />
                        <FormTextField
                            name="newPassword"
                            control={control}
                            margin="normal"
                            required
                            fullWidth
                            label={t('label.newPassword')}
                            type="password"
                        />
                        <FormTextField
                            name="confirmPassword"
                            control={control}
                            margin="normal"
                            required
                            fullWidth
                            label={t('label.confirmPassword')}
                            type="password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {t('btn.changePassword')}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ChangePassword;
