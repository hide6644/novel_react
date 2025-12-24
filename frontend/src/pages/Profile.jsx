import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Box, Card, CardContent, Typography, Button, Alert, Grid } from '@mui/material';
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

    const { control: profileControl, handleSubmit: handleProfileSubmit, reset: resetProfile } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: { firstName: '', lastName: '' }
    });

    // Password Form
    const passwordSchema = z.object({
        currentPassword: z.string().min(1, t('validate.required')),
        newPassword: z.string().min(4, t('validate.minLength', { min: 4 })).max(100, t('validate.maxLength', { max: 100 }))
    });

    const { control: passwordControl, handleSubmit: handlePasswordSubmit, reset: resetPassword, setError: setPasswordError } = useForm({
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
            setProfileMessage(t('msg.profileUpdated'));
            setIsProfileError(false);
        } catch (error) {
            setProfileMessage(t('msg.profileUpdateFailed'));
            setIsProfileError(true);
        }
    };

    const onPasswordChange = async (data) => {
        try {
            await api.put('/profile/password', {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            });
            setMessage(t('msg.passwordUpdated'));
            setIsError(false);
            resetPassword();
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setPasswordError('currentPassword', {
                    type: 'manual',
                    message: t('error.currentPasswordIncorrect')
                });
                setMessage(''); // Clear general message if specific field error exists
            } else {
                setMessage(t('msg.passwordUpdateFailed'));
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
                    <Typography variant="h5" gutterBottom>{t('heading.profileDetails')}</Typography>
                    {profileMessage && (
                        <Alert severity={isProfileError ? 'error' : 'success'} sx={{ mb: 2 }}>
                            {profileMessage}
                        </Alert>
                    )}
                    <Box component="form" onSubmit={handleProfileSubmit(onProfileUpdate)}>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <Typography variant="subtitle2" color="text.secondary">{t('label.username')}</Typography>
                                <Typography variant="h6">{user.username}</Typography>
                            </Grid>
                            <Grid size={6}>
                                <FormTextField
                                    name="lastName"
                                    control={profileControl}
                                    fullWidth
                                    label={t('label.lastName')}
                                />
                            </Grid>
                            <Grid size={6}>
                                <FormTextField
                                    name="firstName"
                                    control={profileControl}
                                    fullWidth
                                    label={t('label.firstName')}
                                />
                            </Grid>
                            <Grid size={6}>
                                <Typography variant="subtitle2" color="text.secondary">{t('label.role')}</Typography>
                                <Typography variant="body1">{user.role}</Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography variant="subtitle2" color="text.secondary">{t('label.expiryDate')}</Typography>
                                <Typography variant="body1">{user.expiryDate}</Typography>
                            </Grid>
                            <Grid size={12}>
                                <Button type="submit" variant="contained">
                                    {t('btn.save')}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>

            <Card sx={{ p: 2 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>{t('profile.changePassword')}</Typography>
                    {message && (
                        <Alert severity={isError ? 'error' : 'success'} sx={{ mb: 2 }}>
                            {message}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handlePasswordSubmit(onPasswordChange)}>
                        <FormTextField
                            name="currentPassword"
                            control={passwordControl}
                            fullWidth
                            label={t('label.currentPassword')}
                            type="password"
                            required
                            sx={{ mb: 2 }}
                        />
                        <FormTextField
                            name="newPassword"
                            control={passwordControl}
                            fullWidth
                            label={t('profile.newPassword')}
                            type="password"
                            required
                            sx={{ mb: 2 }}
                        />
                        <Button type="submit" variant="contained" color="secondary">
                            {t('btn.updatePassword')}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Profile;
