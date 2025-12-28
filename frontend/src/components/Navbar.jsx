import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LanguageIcon from '@mui/icons-material/Language';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import {
    AppBar,
    Box,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [anchorEl, setAnchorEl] = useState(null);

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
                        {t('common.app.title')}
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
                                    {t('nav.admin.label')}
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
