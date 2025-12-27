import { useAuth } from '../context/AuthContext';
import { Controller } from 'react-hook-form';
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
    MenuItem,
    FormControlLabel,
    Switch
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PageHeader from '../components/common/PageHeader';
import FormTextField from '../components/common/FormTextField';
import useCrud from '../hooks/useCrud';

const AdminUserList = () => {
    const { user: currentUser, checkUser } = useAuth();
    const { t } = useTranslation();

    const baseSchemaShape = {
        username: z.string().min(1, t('validate.required')).max(50, t('validate.maxLength', { max: 50 })),
        firstName: z.string().max(50, t('validate.maxLength', { max: 50 })).optional(),
        lastName: z.string().max(50, t('validate.maxLength', { max: 50 })).optional(),
        role: z.string().min(1, t('validate.required')),
        expiryDate: z.string().optional().nullable(),
        enabled: z.boolean().optional()
    };

    const createSchema = z.object({
        ...baseSchemaShape,
        password: z.string().min(4, t('validate.minLength', { min: 4 })).max(100, t('validate.maxLength', { max: 100 }))
    });

    const editSchema = z.object({
        ...baseSchemaShape,
        password: z.string().min(4, t('validate.minLength', { min: 4 })).max(100, t('validate.maxLength', { max: 100 })).optional().or(z.literal(''))
    });

    const {
        items: users,
        isLoading: usersLoading,
        handleDelete,
        openModal: openCrudModal,
        closeModal,
        handleSave,
        showModal,
        isEdit,
        editingId,
        deleteMutation,
        saveMutation
    } = useCrud({
        queryKey: ['admin-users'],
        fetchPath: '/admin/users',
        deletePath: '/admin/users',
        savePath: '/admin/users',
        onSaveSuccess: () => {
            if (isEdit && currentUser && currentUser.id === editingId) {
                checkUser();
            }
        },
        onDeleteSuccess: (id) => {
            if (currentUser && currentUser.id === id) {
                checkUser();
            }
        },
        onSaveError: (error) => {
            if (error.response && error.response.status === 409) {
                setError('username', {
                    type: 'manual',
                    message: t('user.error.usernameExists')
                });
            } else {
                alert(t('common.error.opFailed'));
            }
        },
        isPaginated: false,
    });

    const { control, handleSubmit, reset, setError, formState: { errors } } = useForm({
        resolver: zodResolver(isEdit ? editSchema : createSchema),
        defaultValues: { username: '', password: '', firstName: '', lastName: '', role: 'USER', expiryDate: '', enabled: true }
    });

    // Wrapper for handleSave to prepare data
    const onFormSubmit = (data) => {
        const userData = { ...data };
        if (isEdit) {
            if (!userData.password) delete userData.password;
        }
        handleSave(userData);
    };

    const openModal = (user = null) => {
        openCrudModal(user, (item) => {
            if (item) {
                reset({
                    username: item.username,
                    password: '',
                    firstName: item.firstName || '',
                    lastName: item.lastName || '',
                    role: item.role || 'USER',
                    expiryDate: item.expiryDate || '',
                    enabled: item.enabled
                });
            } else {
                const today = new Date();
                today.setFullYear(today.getFullYear() + 1);
                const nextYearStr = today.toISOString().split('T')[0];
                reset({
                    username: '',
                    password: '',
                    firstName: '',
                    lastName: '',
                    role: 'USER',
                    expiryDate: nextYearStr,
                    enabled: true
                });
            }
        });
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
                            <TableCell>{t('user.label.enabled')}</TableCell>
                            <TableCell>{t('common.table.actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usersLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
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
                                    {row.enabled && <CheckIcon color="success" />}
                                </TableCell>
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
            <Dialog open={showModal} onClose={closeModal} fullWidth maxWidth="xs">
                <DialogTitle>{isEdit ? t('user.edit') : t('user.add')}</DialogTitle>
                <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
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
                            name="password"
                            control={control}
                            margin="dense"
                            label={isEdit ? t('user.label.password') + t('user.label.emptyToKeep') : t('user.label.password')}
                            type="password"
                            fullWidth
                            required={!isEdit}
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
                        <Controller
                            name="enabled"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={<Switch {...field} checked={field.value} />}
                                    label={field.value ? t('common.enable') : t('common.disable')}
                                />
                            )}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeModal}>{t('common.btn.cancel')}</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            loading={saveMutation.isPending}
                        >
                            {t('common.btn.save')}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default AdminUserList;
