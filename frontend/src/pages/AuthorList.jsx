import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
    Box,
    Button,
    TextField,
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/common/PageHeader';
import SearchBox from '../components/common/SearchBox';

const AuthorList = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');

    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentAuthor, setCurrentAuthor] = useState({ name: '', nationality: '', birthDate: '' });

    const { data: authorsData, isLoading: authorsLoading } = useQuery({
        queryKey: ['authors', page, pageSize, appliedSearch],
        queryFn: async () => {
            if (appliedSearch) {
                const res = await api.get('/authors', { params: { name: appliedSearch } });
                // If backend search returns a List, we wrap it into a Page-like structure for the UI
                return {
                    content: res.data,
                    totalPages: 1
                };
            }
            const res = await api.get('/authors/page', { params: { page: page - 1, size: pageSize } });
            return res.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/authors/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['authors'] });
        },
        onError: () => {
            alert(t('error.deleteFailed'));
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
            alert(t('error.opFailed'));
        }
    });

    const handleSearch = () => {
        setAppliedSearch(searchQuery);
        setPage(1);
    };

    const handleDelete = (id) => {
        if (!window.confirm(t('confirm.delete'))) return;
        deleteMutation.mutate(id);
    };

    const handleSave = (e) => {
        e.preventDefault();
        saveMutation.mutate(currentAuthor);
    };

    const openModal = (author = null) => {
        if (author) {
            setIsEdit(true);
            setCurrentAuthor({ ...author });
        } else {
            setIsEdit(false);
            setCurrentAuthor({ name: '', nationality: '', birthDate: '' });
        }
        setShowModal(true);
    };

    const authors = authorsData?.content || [];
    const totalPages = authorsData?.totalPages || 0;

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
                label={t('search.author')}
                buttonLabel={t('btn.search')}
            />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('table.id')}</TableCell>
                            <TableCell>{t('table.name')}</TableCell>
                            <TableCell>{t('table.nationality')}</TableCell>
                            <TableCell>{t('table.birthDate')}</TableCell>
                            {user?.role === 'ADMIN' && <TableCell>{t('table.actions')}</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {authorsLoading ? (
                            <TableRow>
                                <TableCell colSpan={user?.role === 'ADMIN' ? 5 : 4} align="center">
                                    {t('common.loading') || 'Loading...'}
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
                                        <IconButton color="error" onClick={() => handleDelete(author.id)}>
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
                    onChange={(e, v) => setPage(v)}
                    color="primary"
                    showFirstButton
                    showLastButton
                />
            </Box>

            <Dialog open={showModal} onClose={() => setShowModal(false)} fullWidth maxWidth="sm">
                <DialogTitle>{isEdit ? t('author.edit') : t('author.add')}</DialogTitle>
                <form onSubmit={handleSave}>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label={t('label.name')}
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={currentAuthor.name}
                            onChange={e => setCurrentAuthor({ ...currentAuthor, name: e.target.value })}
                            required
                        />
                        <TextField
                            margin="dense"
                            label={t('label.nationality')}
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={currentAuthor.nationality}
                            onChange={e => setCurrentAuthor({ ...currentAuthor, nationality: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label={t('label.birthDate')}
                            type="date"
                            fullWidth
                            variant="outlined"
                            slotProps={{ inputLabel: { shrink: true } }}
                            value={currentAuthor.birthDate}
                            onChange={e => setCurrentAuthor({ ...currentAuthor, birthDate: e.target.value })}
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

export default AuthorList;
