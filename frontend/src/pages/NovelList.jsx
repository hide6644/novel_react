import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    Skeleton,
    TextField,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import api from '../api/axios';
import {
    FormAutocomplete,
    FormTextField,
    PageHeader,
    SearchBox
} from '../components';
import { useAuth } from '../context/AuthContext';
import useCrud from '../hooks/useCrud';

const NovelList = () => {
    const { user } = useAuth();
    const { t } = useTranslation();

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [authorQuery, setAuthorQuery] = useState('');

    const schema = z.object({
        title: z.string().min(1, t('validate.required')).max(100, t('validate.maxLength', { max: 100 })),
        description: z.string().max(1000, t('validate.maxLength', { max: 1000 })).optional(),
        authorId: z.union([z.number(), z.string()]).refine(val => val !== '', t('validate.select')),
        publishDate: z.string().optional().nullable(),
        version: z.number().optional()
    });

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { title: '', description: '', authorId: '', publishDate: '', version: 0 }
    });

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

    const getPageSize = () => {
        if (isSmallScreen) return 6;
        if (isMediumScreen) return 8;
        return 9;
    };

    const dynamicPageSize = getPageSize();

    const {
        // Data
        items: novels,
        isLoading: novelsLoading,

        // Pagination
        page,
        pageSize,
        totalPages,

        // Search & Sort
        sort,

        // Modal State
        showModal,
        isEdit,

        // Actions
        handleSearch: applySearch,
        handleSort,
        handlePageChange,
        handleDelete,
        openModal: openCrudModal,
        closeModal,
        handleSave,

        // Mutations
        deleteMutation,
        saveMutation
    } = useCrud({
        // API Config
        queryKey: ['novels'],
        fetchPath: '/novels',
        deletePath: '/novels',
        savePath: '/novels',

        // Pagination
        pageSize: dynamicPageSize,

        // Search & Sort
        defaultSearchParams: { title: '', author: '' },

        // Callbacks
        onSaveError: (error) => {
            if (isEdit && error.response && error.response.status === 409) {
                alert(t('common.error.conflict'));
            } else {
                alert(t('common.error.opFailed'));
            }
        }
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
                    publishDate: item.publishDate || '',
                    version: item.version
                });
            } else {
                reset({ title: '', description: '', authorId: '', publishDate: '', version: 0 });
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
                <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                        fullWidth
                        label={t('novel.search.title')}
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        size="small"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                        fullWidth
                        label={t('novel.search.author')}
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                        size="small"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 2 }}>
                    <FormControl size="small" fullWidth>
                        <InputLabel id="sort-select-label">{t('common.sort.label')}</InputLabel>
                        <Select
                            labelId="sort-select-label"
                            id="sort-select"
                            value={sort}
                            label={t('common.sort.label')}
                            onChange={(e) => handleSort(e.target.value)}
                        >
                            <MenuItem value=""><em>{t('common.sort.none')}</em></MenuItem>
                            <MenuItem value="title,asc">{t('novel.sort.titleAsc')}</MenuItem>
                            <MenuItem value="title,desc">{t('novel.sort.titleDesc')}</MenuItem>
                            <MenuItem value="author.name,asc">{t('novel.sort.authorAsc')}</MenuItem>
                            <MenuItem value="author.name,desc">{t('novel.sort.authorDesc')}</MenuItem>
                            <MenuItem value="publishDate,asc">{t('novel.sort.dateAsc')}</MenuItem>
                            <MenuItem value="publishDate,desc">{t('novel.sort.dateDesc')}</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </SearchBox>

            <Box sx={{ py: 2, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                />
            </Box>

            <Grid container spacing={3}>
                {novelsLoading ? (
                    // Skeleton Loading
                    Array.from(new Array(pageSize)).map((_, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
                                    <Skeleton variant="text" width="60%" sx={{ mb: 1.5 }} />
                                    <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
                                    <Skeleton variant="text" width="40%" />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
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

            <Box sx={{ py: 2, display: 'flex', justifyContent: 'center', position: 'sticky', bottom: 0, bgcolor: 'background.default', zIndex: 10 }}>
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

export default NovelList;
