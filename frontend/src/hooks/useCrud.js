import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useTranslation } from 'react-i18next';

const useCrud = ({
    queryKey,
    fetchPath,
    deletePath,
    savePath,
    defaultSearchParams = {},
    searchParamMapper = (params) => params,
    onSaveSuccess = () => { },
    onSaveError = null,
    onDeleteSuccess = () => { },
    isPaginated = true,
}) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    // Pagination
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);

    // Search
    const [searchParams, setSearchParams] = useState(defaultSearchParams);

    // Sort
    const [sort, setSort] = useState(defaultSearchParams.sort || '');

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Fetch Data
    const queryKeyDeps = [...queryKey, searchParams, sort];
    if (isPaginated) {
        queryKeyDeps.push(page, pageSize);
    }

    const { data, isLoading } = useQuery({
        queryKey: queryKeyDeps,
        queryFn: async () => {
            const params = {
                ...searchParamMapper(searchParams)
            };
            if (sort) {
                params.sort = sort;
            }
            if (isPaginated) {
                params.page = page - 1;
                params.size = pageSize;
            }
            const res = await api.get(fetchPath, { params });
            return res.data;
        },
    });

    const items = isPaginated ? (data?.content || []) : (data || []);
    const totalPages = isPaginated ? (data?.page.totalPages || 0) : 0;

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`${deletePath}/${id}`),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey });
            onDeleteSuccess(variables);
        },
        onError: () => {
            alert(t('common.error.deleteFailed'));
        }
    });

    // Save Mutation
    const saveMutation = useMutation({
        mutationFn: (item) => {
            if (isEdit) {
                return api.put(`${savePath}/${item.id}`, item);
            }
            return api.post(savePath, item);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            setShowModal(false);
            onSaveSuccess();
        },
        onError: (error) => {
            if (onSaveError) {
                onSaveError(error);
            } else {
                alert(t('common.error.opFailed'));
            }
        }
    });

    // Handlers
    const handleSearch = (newParams) => {
        setSearchParams(newParams);
        setPage(1);
    };

    const handleSort = (newSort) => {
        setSort(newSort);
        setPage(1);
    }

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('common.confirm.delete'))) return;
        deleteMutation.mutate(id);
    };

    const openModal = (item = null, resetForm) => {
        if (item) {
            setIsEdit(true);
            setEditingId(item.id);
            if (resetForm) resetForm(item);
        } else {
            setIsEdit(false);
            setEditingId(null);
            if (resetForm) resetForm();
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleSave = (formData) => {
        const itemData = { ...formData };
        if (isEdit) {
            itemData.id = editingId;
        }
        saveMutation.mutate(itemData);
    };

    return {
        // State
        page,
        pageSize,
        searchParams,
        sort,
        showModal,
        isEdit,
        editingId,
        items,
        totalPages,
        isLoading,

        // Actions
        handleSearch,
        handleSort,
        handlePageChange,
        handleDelete,
        openModal,
        closeModal,
        handleSave,

        // Mutations
        deleteMutation,
        saveMutation
    };
};

export default useCrud;
