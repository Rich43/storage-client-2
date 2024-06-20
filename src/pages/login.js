import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { gql, useLazyQuery } from '@apollo/client';
import { Button, Container, TextField, Typography } from '@mui/material';

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
    const [login, { data, loading, error }] = useLazyQuery(LOGIN_QUERY);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await login({ variables: { username, password } });
            if (data.login.sessionToken) {
                localStorage.setItem('token', data.login.sessionToken);
                router.push('/');
            }
        } catch (err) {
            console.error('Login failed', err);
        }
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Login
            </Typography>
            <form onSubmit={handleLogin}>
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
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Login
                </Button>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
        </Container>
    );
}

export default Login;
