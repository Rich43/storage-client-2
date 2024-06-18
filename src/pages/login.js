import React, { useState } from 'react';
import { Button, Container, TextField, Typography } from '@mui/material';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';

const LOGIN_MUTATION = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            sessionToken
        }
    }
`;

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [login, { error }] = useMutation(LOGIN_MUTATION);

    const handleLogin = async () => {
        try {
            const { data } = await login({ variables: { username, password } });
            const { sessionToken } = data.login;
            localStorage.setItem('token', sessionToken);
            router.push('/');
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
