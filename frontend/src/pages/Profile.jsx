import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Box, Card, CardContent, Typography, Button, Alert, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormTextField from '../components/common/FormTextField';

const Profile = () => {
    const { user, checkUser } = useAuth();
    const { t } = useTranslation();
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [profileMessage, setProfileMessage] = useState('');
    const [isProfileError, setIsProfileError] = useState(false);

    // Profile Form
    const profileSchema = z.object({
        firstName: z.string().max(50, t('validate.maxLength', { max: 50 })).optional(),
        lastName: z.string().max(50, t('validate.maxLength', { max: 50 })).optional()
    });

    const { control: profileControl, handleSubmit: handleProfileSubmit, reset: resetProfile, formState: { isSubmitting: isProfileSubmitting } } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: { firstName: '', lastName: '' }
    });

    // Password Form
    const passwordSchema = z.object({
        currentPassword: z.string().min(1, t('validate.required')),
        newPassword: z.string().min(4, t('validate.minLength', { min: 4 })).max(100, t('validate.maxLength', { max: 100 }))
    });

    const { control: passwordControl, handleSubmit: handlePasswordSubmit, reset: resetPassword, setError: setPasswordError, formState: { isSubmitting: isPasswordSubmitting } } = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: { currentPassword: '', newPassword: '' }
    });

    useEffect(() => {
        if (user) {
            resetProfile({
                firstName: user.firstName || '',
                lastName: user.lastName || ''
            });
        }
    }, [user, resetProfile]);

    const onProfileUpdate = async (data) => {
        try {
            await api.put('/profile/info', data);
            await checkUser();
            setProfileMessage(t('profile.details.success'));
            setIsProfileError(false);
        } catch (error) {
            setProfileMessage(t('profile.details.failed'));
            setIsProfileError(true);
        }
    };

    const onPasswordChange = async (data) => {
        try {
            await api.put('/profile/password', data);
            setMessage(t('profile.updatePassword.success'));
            setIsError(false);
            resetPassword();
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setPasswordError('currentPassword', {
                    type: 'manual',
                    message: t('profile.error.currentPasswordIncorrect')
                });
                setMessage(''); // Clear general message if specific field error exists
            } else {
                setMessage(t('profile.updatePassword.failed'));
                setIsError(true);
            }
        }
    };

    if (!user) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ mt: 4, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                {t('profile.title')}
            </Typography>
            <Card sx={{ p: 2, mb: 4 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>{t('profile.details.header')}</Typography>
                    {profileMessage && (
                        <Alert severity={isProfileError ? 'error' : 'success'} sx={{ mb: 2 }}>
                            {profileMessage}
                        </Alert>
                    )}
                    <Box component="form" onSubmit={handleProfileSubmit(onProfileUpdate)} noValidate>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <Typography variant="subtitle2" color="text.secondary">{t('user.label.username')}</Typography>
                                <Typography variant="h6">{user.username}</Typography>
                            </Grid>
                            <Grid size={6}>
                                <FormTextField
                                    name="lastName"
                                    control={profileControl}
                                    fullWidth
                                    label={t('user.label.lastName')}
                                />
                            </Grid>
                            <Grid size={6}>
                                <FormTextField
                                    name="firstName"
                                    control={profileControl}
                                    fullWidth
                                    label={t('user.label.firstName')}
                                />
                            </Grid>
                            <Grid size={6}>
                                <Typography variant="subtitle2" color="text.secondary">{t('user.label.role')}</Typography>
                                <Typography variant="body1">{user.role}</Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography variant="subtitle2" color="text.secondary">{t('user.label.expiryDate')}</Typography>
                                <Typography variant="body1">{user.expiryDate}</Typography>
                            </Grid>
                            <Grid size={12}>
                                <LoadingButton type="submit" variant="contained" loading={isProfileSubmitting}>
                                    {t('common.btn.save')}
                                </LoadingButton>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>

            <Card sx={{ p: 2 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>{t('profile.changePassword.header')}</Typography>
                    {message && (
                        <Alert severity={isError ? 'error' : 'success'} sx={{ mb: 2 }}>
                            {message}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handlePasswordSubmit(onPasswordChange)} noValidate>
                        <FormTextField
                            name="currentPassword"
                            control={passwordControl}
                            fullWidth
                            label={t('user.label.currentPassword')}
                            type="password"
                            required
                            sx={{ mb: 2 }}
                        />
                        <FormTextField
                            name="newPassword"
                            control={passwordControl}
                            fullWidth
                            label={t('user.label.newPassword')}
                            type="password"
                            required
                            sx={{ mb: 2 }}
                        />
                        <LoadingButton
                            type="submit"
                            variant="contained"
                            color="secondary"
                            loading={isPasswordSubmitting}
                        >
                            {t('profile.updatePassword.btn')}
                        </LoadingButton>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Profile;
