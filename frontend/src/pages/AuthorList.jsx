import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
    Box,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PageHeader from '../components/common/PageHeader';
import SearchBox from '../components/common/SearchBox';
import FormTextField from '../components/common/FormTextField';

const AuthorList = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');

    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const schema = z.object({
        name: z.string().min(1, t('validate.required')).max(100, t('validate.maxLength', { max: 100 })),
        nationality: z.string().max(50, t('validate.maxLength', { max: 50 })).optional(),
        birthDate: z.string().optional().nullable().refine((val) => {
            if (!val) return true;
            return new Date(val) <= new Date();
        }, t('validate.futureDate'))
    });

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { name: '', nationality: '', birthDate: '' }
    });

    const { data: authorsData, isLoading: authorsLoading } = useQuery({
        queryKey: ['authors', page, pageSize, searchQuery],
        queryFn: async () => {
            const params = {
                page: page - 1,
                size: pageSize,
                name: searchQuery
            };
            const res = await api.get('/authors', { params });
            return res.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/authors/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['authors'] });
        },
        onError: () => {
            alert(t('common.error.deleteFailed'));
        }
    });

    const saveMutation = useMutation({
        mutationFn: (author) => {
            if (isEdit) {
                return api.put(`/authors/${author.id}`, author);
            }
            return api.post('/authors', author);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['authors'] });
            setShowModal(false);
        },
        onError: () => {
            alert(t('common.error.opFailed'));
        }
    });

    const handleSearch = () => {
        setAppliedSearch(searchQuery);
        setPage(1);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleDelete = (id) => {
        if (!window.confirm(t('common.confirm.delete'))) return;
        deleteMutation.mutate(id);
    };

    const handleSave = (data) => {
        const authorData = { ...data };
        if (isEdit) {
            authorData.id = editingId;
            saveMutation.mutate(authorData);
        } else {
            saveMutation.mutate(authorData);
        }
    };

    const openModal = (author = null) => {
        if (author) {
            setIsEdit(true);
            setEditingId(author.id);
            reset({
                name: author.name,
                nationality: author.nationality || '',
                birthDate: author.birthDate || ''
            });
        } else {
            setIsEdit(false);
            setEditingId(null);
            reset({ name: '', nationality: '', birthDate: '' });
        }
        setShowModal(true);
    };

    const authors = authorsData?.content || [];
    const totalPages = authorsData?.page.totalPages || 0;

    return (
        <Box>
            <PageHeader
                title={t('author.title')}
                onAdd={() => openModal()}
                addButtonLabel={t('author.add')}
                showAddButton={user?.role === 'ADMIN'}
            />

            <SearchBox
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onSearch={handleSearch}
                label={t('novel.search.author')}
                buttonLabel={t('common.btn.search')}
            />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('common.table.id')}</TableCell>
                            <TableCell>{t('author.label.name')}</TableCell>
                            <TableCell>{t('author.label.nationality')}</TableCell>
                            <TableCell>{t('author.label.birthDate')}</TableCell>
                            {user?.role === 'ADMIN' && <TableCell>{t('common.table.actions')}</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {authorsLoading ? (
                            <TableRow>
                                <TableCell colSpan={user?.role === 'ADMIN' ? 5 : 4} align="center">
                                    {t('common.loading')}
                                </TableCell>
                            </TableRow>
                        ) : authors.map((author) => (
                            <TableRow key={author.id}>
                                <TableCell>{author.id}</TableCell>
                                <TableCell>{author.name}</TableCell>
                                <TableCell>{author.nationality}</TableCell>
                                <TableCell>{author.birthDate}</TableCell>
                                {user?.role === 'ADMIN' && (
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => openModal(author)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(author.id)} disabled={deleteMutation.isPending}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                />
            </Box>

            <Dialog open={showModal} onClose={() => setShowModal(false)} fullWidth maxWidth="sm">
                <DialogTitle>{isEdit ? t('author.edit') : t('author.add')}</DialogTitle>
                <form onSubmit={handleSubmit(handleSave)} noValidate>
                    <DialogContent>
                        <FormTextField
                            name="name"
                            control={control}
                            autoFocus
                            margin="dense"
                            label={t('author.label.name')}
                            type="text"
                            fullWidth
                            variant="outlined"
                            required
                        />
                        <FormTextField
                            name="nationality"
                            control={control}
                            margin="dense"
                            label={t('author.label.nationality')}
                            type="text"
                            fullWidth
                            variant="outlined"
                        />
                        <FormTextField
                            name="birthDate"
                            control={control}
                            margin="dense"
                            label={t('author.label.birthDate')}
                            type="date"
                            fullWidth
                            variant="outlined"
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

export default AuthorList;
