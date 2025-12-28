import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Pagination,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import {
    FormTextField,
    PageHeader,
    SearchBox
} from '../components';
import { useAuth } from '../context/AuthContext';
import useCrud from '../hooks/useCrud';

const AuthorList = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');

    const schema = z.object({
        name: z.string().min(1, t('validate.required')).max(100, t('validate.maxLength', { max: 100 })),
        nationality: z.string().max(100, t('validate.maxLength', { max: 100 })).optional(),
        birthDate: z.string().optional().nullable().refine((val) => {
            if (!val) return true;
            return new Date(val) <= new Date();
        }, t('validate.futureDate'))
    });

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { name: '', nationality: '', birthDate: '' }
    });

    const {
        page,
        items: authors,
        totalPages,
        isLoading: authorsLoading,
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
        queryKey: ['authors'],
        fetchPath: '/authors',
        deletePath: '/authors',
        savePath: '/authors',
        defaultSearchParams: { name: '' }
    });

    const handleSearch = () => {
        applySearch({ name: searchQuery });
    };

    const openModal = (author = null) => {
        openCrudModal(author, (item) => {
            if (item) {
                reset({
                    name: item.name,
                    nationality: item.nationality || '',
                    birthDate: item.birthDate || ''
                });
            } else {
                reset({ name: '', nationality: '', birthDate: '' });
            }
        });
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
                onSearch={handleSearch}
                buttonLabel={t('common.btn.search')}
            >
                <Grid size={{ xs: 12, sm: 10 }}>
                    <TextField
                        fullWidth
                        label={t('novel.search.author')}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        size="small"
                    />
                </Grid>
            </SearchBox>

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

            <Dialog open={showModal} onClose={closeModal} fullWidth maxWidth="sm">
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

export default AuthorList;
