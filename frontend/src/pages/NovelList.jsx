import { useState, useEffect } from 'react';
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
    Pagination,
    Autocomplete
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/common/PageHeader';

const NovelList = () => {
    const { user } = useAuth();
    const [novels, setNovels] = useState([]);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const { t } = useTranslation();

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentNovel, setCurrentNovel] = useState({ title: '', description: '', authorId: '', publishDate: '' });
    const [authors, setAuthors] = useState([]);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(10); // Fixed page size or make it selectable

    const fetchNovels = async () => {
        try {
            const params = {
                page: page - 1, // backend is 0-indexed
                size: pageSize
            };
            if (title) params.title = title;
            if (author) params.author = author;
            const res = await api.get('/novels', { params });
            // Handle Page response
            setNovels(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAuthors = async (query = '') => {
        try {
            const params = query ? { name: query } : {};
            const res = await api.get('/authors', { params });
            setAuthors(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchNovels();
    }, [page]); // Re-fetch when page changes

    useEffect(() => {
        fetchAuthors();
    }, []);

    const handleSearch = () => {
        if (page === 1) {
            fetchNovels();
        } else {
            setPage(1);
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };
    // ... handleDelete, handleSave ... (omitted for brevity in replacement, need to ensure I don't delete them)


    const handleDelete = async (id) => {
        if (!window.confirm(t('novel.deleteConfirm'))) return;
        try {
            await api.delete(`/novels/${id}`);
            fetchNovels();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await api.put(`/novels/${currentNovel.id}`, currentNovel);
            } else {
                await api.post('/novels', currentNovel);
            }
            setShowModal(false);
            fetchNovels();
        } catch (error) {
            alert(t('error.opFailed'));
        }
    };

    const openModal = (novel = null) => {
        if (novel) {
            setIsEdit(true);
            setCurrentNovel({ ...novel });
        } else {
            setIsEdit(false);
            setCurrentNovel({ title: '', description: '', authorId: '', publishDate: '' });
        }
        fetchAuthors(); // Ensure author list is reset/fresh
        setShowModal(true);
    };

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
                            label={t('search.title')}
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            size="small"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 5 }}>
                        <TextField
                            fullWidth
                            label={t('search.author')}
                            value={author}
                            onChange={e => setAuthor(e.target.value)}
                            size="small"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 2 }}>
                        <Button fullWidth variant="contained" startIcon={<SearchIcon />} onClick={handleSearch}>
                            {t('btn.search')}
                        </Button>
                    </Grid>
                </Grid>
            </Card>

            <Grid container spacing={3}>
                {novels.map(novel => (
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
                <form onSubmit={handleSave}>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label={t('label.title')}
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={currentNovel.title}
                            onChange={e => setCurrentNovel({ ...currentNovel, title: e.target.value })}
                            required
                        />
                        <TextField
                            margin="dense"
                            label={t('label.description')}
                            type="text"
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            value={currentNovel.description}
                            onChange={e => setCurrentNovel({ ...currentNovel, description: e.target.value })}
                        />
                        <Autocomplete
                            options={authors}
                            getOptionLabel={(option) => option.name || ''}
                            value={authors.find(a => a.id === currentNovel.authorId) || null}
                            onChange={(event, newValue) => {
                                setCurrentNovel({ ...currentNovel, authorId: newValue ? newValue.id : '' });
                            }}
                            onInputChange={(event, newInputValue) => {
                                if (newInputValue) {
                                    fetchAuthors(newInputValue);
                                } else {
                                    fetchAuthors(); // reset to default list
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t('label.author')}
                                    margin="dense"
                                    variant="outlined"
                                    required
                                />
                            )}
                        />
                        <TextField
                            margin="dense"
                            label={t('label.publishDate')}
                            type="date"
                            fullWidth
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            value={currentNovel.publishDate}
                            onChange={e => setCurrentNovel({ ...currentNovel, publishDate: e.target.value })}
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

export default NovelList;
