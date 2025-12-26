import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { LoadingButton } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchBox from '../components/common/SearchBox';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/common/PageHeader';
import FormTextField from '../components/common/FormTextField';
import FormAutocomplete from '../components/common/FormAutocomplete';
import useCrud from '../hooks/useCrud';

const NovelList = () => {
    const { user } = useAuth();
    const { t } = useTranslation();

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
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

    // useCrud Hook
    const {
        page,
        items: novels,
        totalPages,
        isLoading: novelsLoading,
        handlePageChange,
        handleDelete,
        openModal: openCrudModal,
        closeModal,
        handleSave,
        showModal,
        isEdit,
        deleteMutation,
        saveMutation,
        handleSearch: applySearch
    } = useCrud({
        queryKey: ['novels'],
        fetchPath: '/novels',
        deletePath: '/novels',
        savePath: '/novels',
        defaultSearchParams: { title: '', author: '' },
    });

    // Fetch Authors for Autocomplete
    const { data: authors = [] } = useQuery({
        queryKey: ['authors', authorQuery],
        queryFn: async () => {
            const params = authorQuery ? { name: authorQuery } : {};
            const res = await api.get('/authors/autocomplete', { params });
            return res.data;
        },
    });

    const handleSearch = () => {
        applySearch({ title, author });
    };

    const openModal = (novel = null) => {
        setAuthorQuery('');
        openCrudModal(novel, (item) => {
            if (item) {
                reset({
                    title: item.title,
                    description: item.description || '',
                    authorId: item.authorId,
                    publishDate: item.publishDate || ''
                });
            } else {
                reset({ title: '', description: '', authorId: '', publishDate: '' });
            }
        });
    };

    return (
        <Box>
            <PageHeader
                title={t('novel.title')}
                onAdd={() => openModal()}
                addButtonLabel={t('novel.add')}
                showAddButton={user?.role === 'ADMIN'}
            />

            <SearchBox
                onSearch={handleSearch}
                buttonLabel={t('common.btn.search')}
            >
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
            </SearchBox>

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
                                    <IconButton color="error" onClick={() => handleDelete(novel.id)} disabled={deleteMutation.isPending}>
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
            <Dialog open={showModal} onClose={closeModal} fullWidth maxWidth="sm">
                <DialogTitle>{isEdit ? t('novel.edit') : t('novel.add')}</DialogTitle>
                <form onSubmit={handleSubmit(handleSave)} noValidate>
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
                        <Button onClick={closeModal}>{t('common.btn.cancel')}</Button>
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

export default NovelList;
