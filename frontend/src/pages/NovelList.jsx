import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    TextField,
    Grid,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Pagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/common/PageHeader';
import FormTextField from '../components/common/FormTextField';
import FormAutocomplete from '../components/common/FormAutocomplete';

const NovelList = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [searchParams, setSearchParams] = useState({ title: '', author: '' });

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [authorQuery, setAuthorQuery] = useState('');

    const schema = z.object({
        title: z.string().min(1, t('validate.required')).max(100, t('validate.maxLength', { max: 100 })),
        description: z.string().max(500, t('validate.maxLength', { max: 500 })).optional(),
        authorId: z.union([z.number(), z.string()]).refine(val => val !== '', t('validate.select')),
        publishDate: z.string().optional().nullable()
    });

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { title: '', description: '', authorId: '', publishDate: '' }
    });

    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);

    // Fetch Novels
    const { data: novelsData, isLoading: novelsLoading } = useQuery({
        queryKey: ['novels', page, pageSize, searchParams],
        queryFn: async () => {
            const params = {
                page: page - 1,
                size: pageSize,
                ...searchParams
            };
            const res = await api.get('/novels', { params });
            return res.data;
        },
    });

    // Fetch Authors for Autocomplete
    const { data: authors = [] } = useQuery({
        queryKey: ['authors', authorQuery],
        queryFn: async () => {
            const params = authorQuery ? { name: authorQuery } : {};
            const res = await api.get('/authors', { params });
            return res.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/novels/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['novels'] });
        },
    });

    const saveMutation = useMutation({
        mutationFn: (novel) => {
            if (isEdit) {
                return api.put(`/novels/${novel.id}`, novel);
            }
            return api.post('/novels', novel);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['novels'] });
            setShowModal(false);
        },
        onError: () => {
            alert(t('common.error.opFailed'));
        }
    });

    const handleSearch = () => {
        setSearchParams({ title, author });
        setPage(1);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('novel.deleteConfirm'))) return;
        deleteMutation.mutate(id);
    };

    const onSubmit = (data) => {
        const novelData = { ...data };
        if (isEdit) {
            novelData.id = editingId;
        }
        saveMutation.mutate(novelData);
    };

    const openModal = (novel = null) => {
        if (novel) {
            setIsEdit(true);
            setEditingId(novel.id);
            reset({
                title: novel.title,
                description: novel.description || '',
                authorId: novel.authorId,
                publishDate: novel.publishDate || ''
            });
        } else {
            setIsEdit(false);
            setEditingId(null);
            reset({ title: '', description: '', authorId: '', publishDate: '' });
        }
        setAuthorQuery('');
        setShowModal(true);
    };

    const novels = novelsData?.content || [];
    const totalPages = novelsData?.page.totalPages || 0;

    return (
        <Box>
            <PageHeader
                title={t('novel.title')}
                onAdd={() => openModal()}
                addButtonLabel={t('novel.add')}
                showAddButton={user?.role === 'ADMIN'}
            />

            <Card sx={{ mb: 4, p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, sm: 5 }}>
                        <TextField
                            fullWidth
                            label={t('novel.search.title')}
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            size="small"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 5 }}>
                        <TextField
                            fullWidth
                            label={t('novel.search.author')}
                            value={author}
                            onChange={e => setAuthor(e.target.value)}
                            size="small"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 2 }}>
                        <Button fullWidth variant="contained" startIcon={<SearchIcon />} onClick={handleSearch}>
                            {t('common.btn.search')}
                        </Button>
                    </Grid>
                </Grid>
            </Card>

            <Grid container spacing={3}>
                {novelsLoading ? (
                    <Typography sx={{ m: 2 }}>{t('common.loading')}</Typography>
                ) : novels.map(novel => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={novel.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h5" component="div" gutterBottom>
                                    {novel.title}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    {t('novel.by')} {novel.authorName}
                                </Typography>
                                <Typography variant="body2">
                                    {novel.description}
                                </Typography>
                                <Typography variant="caption" display="block" sx={{ mt: 2 }} color="text.secondary">
                                    {t('novel.published')} {novel.publishDate}
                                </Typography>
                            </CardContent>
                            {user?.role === 'ADMIN' && (
                                <CardActions>
                                    <IconButton color="primary" onClick={() => openModal(novel)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(novel.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            )}
                        </Card>
                    </Grid>
                ))}
            </Grid>

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

            {/* Dialog */}
            <Dialog open={showModal} onClose={() => setShowModal(false)} fullWidth maxWidth="sm">
                <DialogTitle>{isEdit ? t('novel.edit') : t('novel.add')}</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <DialogContent>
                        <FormTextField
                            name="title"
                            control={control}
                            autoFocus
                            margin="dense"
                            label={t('novel.label.title')}
                            type="text"
                            fullWidth
                            variant="outlined"
                            required
                        />
                        <FormTextField
                            name="description"
                            control={control}
                            margin="dense"
                            label={t('novel.label.description')}
                            type="text"
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                        />
                        <FormAutocomplete
                            name="authorId"
                            control={control}
                            options={authors}
                            label={t('novel.label.author')}
                        />
                        <FormTextField
                            name="publishDate"
                            control={control}
                            margin="dense"
                            label={t('novel.label.publishDate')}
                            type="date"
                            fullWidth
                            variant="outlined"
                            slotProps={{ inputLabel: { shrink: true } }}
                            required
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowModal(false)}>{t('common.btn.cancel')}</Button>
                        <Button type="submit" variant="contained">{t('common.btn.save')}</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default NovelList;
