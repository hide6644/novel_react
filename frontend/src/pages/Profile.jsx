import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Profile = () => {
    const { user } = useAuth();
    const [password, setPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const { t } = useTranslation();

    const [profileData, setProfileData] = useState({ firstName: '', lastName: '' });
    const [profileMessage, setProfileMessage] = useState('');
    const [isProfileError, setIsProfileError] = useState(false);

    React.useEffect(() => {
        if (user) {
            setProfileData({
                firstName: user.firstName || '',
                lastName: user.lastName || ''
            });
        }
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put('/profile/info', profileData);
            setProfileMessage(t('msg.profileUpdated'));
            setIsProfileError(false);
        } catch (error) {
            setProfileMessage(t('msg.profileUpdateFailed'));
            setIsProfileError(true);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            await api.put('/profile/password', { oldPassword, password });
            setMessage(t('msg.passwordUpdated'));
            setIsError(false);
            setPassword('');
            setOldPassword('');
        } catch (error) {
            setMessage(t('msg.passwordUpdateFailed'));
            setIsError(true);
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
                    <Box component="form" onSubmit={handleProfileUpdate}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="text.secondary">{t('label.username')}</Typography>
                                <Typography variant="h6">{user.username}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label={t('label.lastName')}
                                    value={profileData.lastName}
                                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label={t('label.firstName')}
                                    value={profileData.firstName}
                                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">{t('label.role')}</Typography>
                                <Typography variant="body1">{user.role}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">{t('label.expiryDate')}</Typography>
                                <Typography variant="body1">{user.expiryDate}</Typography>
                            </Grid>
                            <Grid item xs={12}>
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

                    <Box component="form" onSubmit={handlePasswordChange}>
                        <TextField
                            fullWidth
                            label={t('label.currentPassword')}
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label={t('profile.newPassword')}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
