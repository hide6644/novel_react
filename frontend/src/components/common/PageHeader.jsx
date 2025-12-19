import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const PageHeader = ({ title, onAdd, addButtonLabel, showAddButton = true }) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1">{title}</Typography>
            {showAddButton && (
                <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
                    {addButtonLabel}
                </Button>
            )}
        </Box>
    );
};

export default PageHeader;
