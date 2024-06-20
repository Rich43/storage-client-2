import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/features/auth/authSlice';
import { Alert, Box, Button, Container, TextField, Typography } from '@mui/material';
import styled from '@emotion/styled';

const LoginBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
`;

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const router = useRouter();
    const { loading, error } = useSelector((state) => state.auth);


    const handleLogin = async (e) => {
        e.preventDefault();
        const result = await dispatch(login({ username, password }));
        if (login.fulfilled.match(result)) {
            await router.push('/');
        }
    };

    return (
        <Container>
            <LoginBox>
                <Typography variant="h4" component="h1" gutterBottom>
                    Login
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '400px' }}>
                    <TextField
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                        margin="normal"
                        error={!!error}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        error={!!error}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
            </LoginBox>
        </Container>
    );
}

export default Login;
