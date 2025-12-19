import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleLanguageClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleLanguageClose = (lang) => {
        if (lang) {
            i18n.changeLanguage(lang);
        }
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Toolbar>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                    <MenuBookIcon sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                        {t('app.title')}
                    </Typography>
                </Link>

                <Button color="inherit" component={Link} to="/authors" sx={{ ml: 2 }}>
                    {t('nav.authors')}
                </Button>

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton color="inherit" onClick={handleLanguageClick}>
                        <LanguageIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => handleLanguageClose()}
                    >
                        <MenuItem onClick={() => handleLanguageClose('en')}>English</MenuItem>
                        <MenuItem onClick={() => handleLanguageClose('ja')}>日本語</MenuItem>
                    </Menu>

                    {user ? (
                        <>
                            {user.role === 'ADMIN' && (
                                <Button color="inherit" component={Link} to="/admin/users" startIcon={<AdminPanelSettingsIcon />}>
                                    {t('nav.admin')}
                                </Button>
                            )}
                            <Button color="inherit" component={Link} to="/profile" startIcon={<AccountCircleIcon />}>
                                {user.username}
                            </Button>
                            <IconButton color="error" onClick={handleLogout} size="small">
                                <LogoutIcon />
                            </IconButton>
                        </>
                    ) : (
                        <Button variant="contained" color="primary" component={Link} to="/login">
                            {t('nav.login')}
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
