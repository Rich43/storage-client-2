import React, { useState } from 'react';
import { Button, Container, TextField, Typography } from '@mui/material';
import { gql, useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/router';

const LOGIN_QUERY = gql`
    query login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            sessionToken
        }
    }
`;

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [login, { data, error }] = useLazyQuery(LOGIN_QUERY);

    const handleLogin = async () => {
        try {
            await login({ variables: { username, password } });
            if (data) {
                const { sessionToken } = data.login;
                localStorage.setItem('token', sessionToken);
                await router.push('/');
            }
        } catch (e) {
            console.error('Login failed', e);
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>
            <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
            />
            {error && <Typography color="error">Login failed</Typography>}
            <Button variant="contained" color="primary" onClick={handleLogin}>
                Login
            </Button>
        </Container>
    );
}

export default Login;
