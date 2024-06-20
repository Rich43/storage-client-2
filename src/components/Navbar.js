import React from 'react';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/features/auth/authSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Image src="/logo.svg" alt="Logo" width={40} height={40} />
                <Typography variant="h6" style={{ flexGrow: 1, marginLeft: '10px' }}>
                    Storage
                </Typography>
                {user ? (
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                ) : (
                    <Button color="inherit">Login</Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
