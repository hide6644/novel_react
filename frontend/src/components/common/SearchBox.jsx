import React from 'react';
import { Card, Grid, TextField, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBox = ({ value, onChange, onSearch, placeholder, label }) => {
    return (
        <Card sx={{ mb: 4, p: 2 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={10}>
                    <TextField
                        fullWidth
                        label={label || placeholder}
                        value={value}
                        onChange={onChange}
                        size="small"
                        placeholder={placeholder}
                    />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <Button fullWidth variant="contained" startIcon={<SearchIcon />} onClick={onSearch}>
                        Search
                    </Button>
                </Grid>
            </Grid>
        </Card>
    );
};

export default SearchBox;
