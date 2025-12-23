import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';
import Profile from './pages/Profile';
import NovelList from './pages/NovelList';
import AuthorList from './pages/AuthorList';
import AdminUserList from './pages/AdminUserList';
import { Box } from '@mui/material';

const ProtectedRoute = ({ roles = [] }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (roles.length > 0 && !roles.includes(user.role)) return <Navigate to="/" />;

    return <Outlet />;
};

const Layout = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Outlet />
            </Box>
        </Box>
    );
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <Router>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/change-password" element={<ChangePassword />} />

                            <Route element={<Layout />}>
                                <Route element={<ProtectedRoute />}>
                                    <Route path="/" element={<NovelList />} />
                                    <Route path="/authors" element={<AuthorList />} />
                                    <Route path="/profile" element={<Profile />} />
                                </Route>

                                <Route element={<ProtectedRoute roles={['ADMIN']} />}>
                                    <Route path="/admin/users" element={<AdminUserList />} />
                                </Route>
                            </Route>
                        </Routes>
                    </Router>
                </AuthProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;
