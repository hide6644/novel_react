import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/common/PageHeader';

const AdminUserList = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentUser, setCurrentUser] = useState({ username: '', password: '', role: 'USER', expiryDate: '', firstName: '', lastName: '' });

    const { data: users = [], isLoading: usersLoading } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const res = await api.get('/admin/users');
            return res.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/admin/users/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        },
    });

    const saveMutation = useMutation({
        mutationFn: (user) => {
            if (isEdit) {
                const payload = { ...user };
                if (!payload.password) delete payload.password;
                return api.put(`/admin/users/${user.id}`, payload);
            }
            return api.post('/admin/users', user);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            setShowModal(false);
        },
        onError: (error) => {
            if (error.response && error.response.status === 409) {
                alert(t('error.usernameExists'));
            } else {
                alert(t('error.opFailed'));
            }
        }
    });

    const handleDelete = (id) => {
        if (!window.confirm(t('novel.deleteConfirm'))) return;
        deleteMutation.mutate(id);
    };

    const handleSave = (e) => {
        e.preventDefault();
        saveMutation.mutate(currentUser);
    };

    const openModal = (user = null) => {
        if (user) {
            setIsEdit(true);
            setCurrentUser({ ...user, password: '' });
        } else {
            setIsEdit(false);
            const today = new Date();
            today.setFullYear(today.getFullYear() + 1);
            const nextYearStr = today.toISOString().split('T')[0];
            setCurrentUser({ username: '', password: '', role: 'USER', expiryDate: nextYearStr, firstName: '', lastName: '' });
        }
        setShowModal(true);
    };

    return (
        <Box>
            <PageHeader
                title={t('admin.user.title')}
                onAdd={() => openModal()}
                addButtonLabel={t('admin.user.add')}
            />

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="user table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>{t('label.username')}</TableCell>
                            <TableCell>{t('label.firstName')}</TableCell>
                            <TableCell>{t('label.lastName')}</TableCell>
                            <TableCell>{t('label.role')}</TableCell>
                            <TableCell>{t('label.expiryDate')}</TableCell>
                            <TableCell>{t('table.actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usersLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    {t('common.loading') || 'Loading...'}
                                </TableCell>
                            </TableRow>
                        ) : users.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.username}</TableCell>
                                <TableCell>{row.firstName}</TableCell>
                                <TableCell>{row.lastName}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={row.role}
                                        color={row.role === 'ADMIN' ? 'primary' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{row.expiryDate}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => openModal(row)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(row.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog */}
            <Dialog open={showModal} onClose={() => setShowModal(false)} fullWidth maxWidth="xs">
                <DialogTitle>{isEdit ? t('admin.user.edit') : t('admin.user.add')}</DialogTitle>
                <form onSubmit={handleSave}>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label={t('label.username')}
                            fullWidth
                            value={currentUser.username}
                            onChange={e => setCurrentUser({ ...currentUser, username: e.target.value })}
                            required
                            disabled={isEdit}
                        />
                        <TextField
                            margin="dense"
                            label={t('label.lastName')}
                            fullWidth
                            value={currentUser.lastName || ''}
                            onChange={e => setCurrentUser({ ...currentUser, lastName: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label={t('label.firstName')}
                            fullWidth
                            value={currentUser.firstName || ''}
                            onChange={e => setCurrentUser({ ...currentUser, firstName: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label={isEdit ? t('label.password') + t('label.emptyToKeep') : t('label.password')}
                            type="password"
                            fullWidth
                            value={currentUser.password || ''}
                            onChange={e => setCurrentUser({ ...currentUser, password: e.target.value })}
                            required={!isEdit}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>{t('label.role')}</InputLabel>
                            <Select
                                value={currentUser.role}
                                label={t('label.role')}
                                onChange={e => setCurrentUser({ ...currentUser, role: e.target.value })}
                            >
                                <MenuItem value="USER">USER</MenuItem>
                                <MenuItem value="ADMIN">ADMIN</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            margin="dense"
                            label={t('label.expiryDate')}
                            type="date"
                            fullWidth
                            slotProps={{ inputLabel: { shrink: true } }}
                            value={currentUser.expiryDate || ''}
                            onChange={e => setCurrentUser({ ...currentUser, expiryDate: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowModal(false)}>{t('btn.cancel')}</Button>
                        <Button type="submit" variant="contained">{t('btn.save')}</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default AdminUserList;
