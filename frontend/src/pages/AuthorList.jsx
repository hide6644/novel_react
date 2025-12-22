import { useState, useEffect, useCallback } from 'react';
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
    const { t } = useTranslation();
    const [authors, setAuthors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Pagination (Client-side for now as per backend list endpoint, or switch to server-side if using page endpoint. 
    // Plan said "List authors with pagination". Backend has /api/authors (list) and /api/authors/page (page). 
    // Let's use /api/authors/page for scalability matching novels)
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(10);

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentAuthor, setCurrentAuthor] = useState({ name: '', nationality: '', birthDate: '' });

    const fetchAuthors = useCallback(async () => {
        try {
            // If searching, we might use the search endpoint which returns a List, or need to support pagination on search.
            // Backend Controller: search returns List, page returns Page. 
            // Let's stick to /api/authors/page for main list, and if search is active, maybe client-side or switch endpoint?
            // The Search endpoint /api/authors?name=.. returns List. 
            // For consistency and ease, let's use the page endpoint for default, and if search is present, use search endpoint (and maybe disable backend pagination or client-side paginate the result).
            // Actually, for large datasets, search should also be paginated. But currently backend search returns List.
            // Let's implement logic: 
            // If searchQuery: use /api/authors?name=... (List) -> client side pagination or just show all
            // Else: use /api/authors/page (Page)

            if (searchQuery) {
                const res = await api.get('/authors', { params: { name: searchQuery } });
                setAuthors(res.data);
                setTotalPages(1); // Search results not paginated in backend yet
            } else {
                const res = await api.get('/authors/page', { params: { page: page - 1, size: pageSize } });
                setAuthors(res.data.content);
                setTotalPages(res.data.totalPages);
            }
        } catch (error) {
            console.error(error);
        }
    }, [page, pageSize, searchQuery]);

    useEffect(() => {
        fetchAuthors();
    }, [fetchAuthors]); // Re-fetch on page change

    const handleSearch = () => {
        setPage(1);
        fetchAuthors();
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('confirm.delete'))) return;
        try {
            await api.delete(`/authors/${id}`);
            fetchAuthors();
        } catch (error) {
            alert(t('error.deleteFailed'));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await api.put(`/authors/${currentAuthor.id}`, currentAuthor);
            } else {
                await api.post('/authors', currentAuthor);
            }
            setShowModal(false);
            fetchAuthors();
        } catch (error) {
            alert(t('error.opFailed'));
        }
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
                        {authors.map((author) => (
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
                            InputLabelProps={{ shrink: true }}
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
