import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Button, TextField, Typography, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const ChangePassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [username, setUsername] = useState(location.state?.username || '');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError(t('error.passwordMismatch') || 'Passwords do not match');
            return;
        }

        try {
            await api.post('/auth/change-password', {
                username,
                oldPassword,
                newPassword
            });
            setSuccess(t('success.passwordChanged') || 'Password changed successfully');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || t('error.changePasswordFailed') || 'Failed to change password');
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', mt: -5 }}>
            <Card sx={{ width: '100%', maxWidth: 400, p: 2 }}>
                <CardContent>
                    <Typography variant="h5" component="h2" align="center" gutterBottom>
                        {t('title.changePassword') || 'Change Password'}
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label={t('label.username') || 'Username'}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={!!location.state?.username}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label={t('label.currentPassword') || 'Current Password'}
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label={t('label.newPassword') || 'New Password'}
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label={t('label.confirmPassword') || 'Confirm New Password'}
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {t('btn.changePassword') || 'Change Password'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ChangePassword;
