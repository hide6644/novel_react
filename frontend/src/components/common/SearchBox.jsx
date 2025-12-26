import { Card, Grid, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBox = ({ onSearch, buttonLabel, children }) => {
    return (
        <Card sx={{ mb: 4, p: 2 }}>
            <Grid container spacing={2} alignItems="center">
                {children}
                <Grid size={{ xs: 12, sm: 2 }}>
                    <Button fullWidth variant="contained" startIcon={<SearchIcon />} onClick={onSearch}>
                        {buttonLabel}
                    </Button>
                </Grid>
            </Grid>
        </Card>
    );
};

export default SearchBox;
