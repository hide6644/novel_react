import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
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
    Chip,
    MenuItem
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PageHeader from '../components/common/PageHeader';
import FormTextField from '../components/common/FormTextField';

const AdminUserList = () => {
    const queryClient = useQueryClient();
    const { user: currentUser, checkUser } = useAuth();
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const baseSchemaShape = {
        username: z.string().min(1, t('validate.required')).max(50, t('validate.maxLength', { max: 50 })),
        firstName: z.string().max(50, t('validate.maxLength', { max: 50 })).optional(),
        lastName: z.string().max(50, t('validate.maxLength', { max: 50 })).optional(),
        role: z.string().min(1, t('validate.required')),
        expiryDate: z.string().optional().nullable()
    };

    const createSchema = z.object({
        ...baseSchemaShape,
        password: z.string().min(4, t('validate.minLength', { min: 4 })).max(100, t('validate.maxLength', { max: 100 }))
    });

    const editSchema = z.object({
        ...baseSchemaShape,
        password: z.string().min(4, t('validate.minLength', { min: 4 })).max(100, t('validate.maxLength', { max: 100 })).optional().or(z.literal(''))
    });

    const { control, handleSubmit, reset, setError, formState: { errors } } = useForm({
        resolver: zodResolver(isEdit ? editSchema : createSchema),
        defaultValues: { username: '', firstName: '', lastName: '', role: 'USER', expiryDate: '', password: '' }
    });

    const { data: users = [], isLoading: usersLoading } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const res = await api.get('/admin/users');
            return res.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/admin/users/${id}`),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            if (currentUser && currentUser.id === id) {
                checkUser();
            }
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
            if (isEdit && currentUser && currentUser.id === editingId) {
                checkUser();
            }
        },
        onError: (error) => {
            if (error.response && error.response.status === 409) {
                setError('username', {
                    type: 'manual',
                    message: t('user.error.usernameExists')
                });
            } else {
                alert(t('common.error.opFailed'));
            }
        }
    });

    const handleDelete = (id) => {
        if (!window.confirm(t('novel.deleteConfirm'))) return;
        deleteMutation.mutate(id);
    };

    const handleSave = (data) => {
        const userData = { ...data };
        if (isEdit) {
            if (!userData.password) delete userData.password;
            userData.id = editingId;
            saveMutation.mutate(userData);
        } else {
            saveMutation.mutate(userData);
        }
    };

    const openModal = (user = null) => {
        if (user) {
            setIsEdit(true);
            setEditingId(user.id);
            reset({
                username: user.username,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                role: user.role || 'USER',
                expiryDate: user.expiryDate || '',
                password: ''
            });
        } else {
            setIsEdit(false);
            setEditingId(null);
            const today = new Date();
            today.setFullYear(today.getFullYear() + 1);
            const nextYearStr = today.toISOString().split('T')[0];
            reset({
                username: '',
                firstName: '',
                lastName: '',
                role: 'USER',
                expiryDate: nextYearStr,
                password: ''
            });
        }
        setShowModal(true);
    };

    return (
        <Box>
            <PageHeader
                title={t('user.title')}
                onAdd={() => openModal()}
                addButtonLabel={t('user.add')}
            />

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="user table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>{t('user.label.username')}</TableCell>
                            <TableCell>{t('user.label.firstName')}</TableCell>
                            <TableCell>{t('user.label.lastName')}</TableCell>
                            <TableCell>{t('user.label.role')}</TableCell>
                            <TableCell>{t('user.label.expiryDate')}</TableCell>
                            <TableCell>{t('common.table.actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usersLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    {t('common.loading')}
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
                                    <IconButton color="error" onClick={() => handleDelete(row.id)} disabled={deleteMutation.isPending}>
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
                <DialogTitle>{isEdit ? t('user.edit') : t('user.add')}</DialogTitle>
                <form onSubmit={handleSubmit(handleSave)} noValidate>
                    <DialogContent>
                        <FormTextField
                            name="username"
                            control={control}
                            margin="dense"
                            label={t('user.label.username')}
                            fullWidth
                            required
                            disabled={isEdit}
                        />
                        <FormTextField
                            name="lastName"
                            control={control}
                            margin="dense"
                            label={t('user.label.lastName')}
                            fullWidth
                        />
                        <FormTextField
                            name="firstName"
                            control={control}
                            margin="dense"
                            label={t('user.label.firstName')}
                            fullWidth
                        />
                        <FormTextField
                            name="password"
                            control={control}
                            margin="dense"
                            label={isEdit ? t('user.label.password') + t('user.label.emptyToKeep') : t('user.label.password')}
                            type="password"
                            fullWidth
                            required={!isEdit}
                        />
                        <FormTextField
                            select
                            name="role"
                            control={control}
                            margin="dense"
                            label={t('user.label.role')}
                            fullWidth
                        >
                            <MenuItem value="USER">USER</MenuItem>
                            <MenuItem value="ADMIN">ADMIN</MenuItem>
                        </FormTextField>
                        <FormTextField
                            name="expiryDate"
                            control={control}
                            margin="dense"
                            label={t('user.label.expiryDate')}
                            type="date"
                            fullWidth
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowModal(false)}>{t('common.btn.cancel')}</Button>
                        <LoadingButton
                            type="submit"
                            variant="contained"
                            loading={saveMutation.isPending}
                        >
                            {t('common.btn.save')}
                        </LoadingButton>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default AdminUserList;
