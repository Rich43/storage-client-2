import React from 'react';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';

function Navbar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Media Sharing App
                </Typography>
                <Link href="/" passHref>
                    <Button color="inherit">Home</Button>
                </Link>
                <Link href="/upload" passHref>
                    <Button color="inherit">Upload</Button>
                </Link>
                <Link href="/login" passHref>
                    <Button color="inherit">Login</Button>
                </Link>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
