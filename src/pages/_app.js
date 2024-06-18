import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import client from '../lib/apolloClient';
import '../styles/globals.css';

const theme = createTheme({
    palette: {
        primary: {
            main: '#3f51b5',
        },
        secondary: {
            main: '#f50057',
        },
    },
});

function MyApp({ Component, pageProps }) {
    return (
        <ApolloProvider client={client}>
            <ThemeProvider theme={theme}>
                <Component {...pageProps} />
            </ThemeProvider>
        </ApolloProvider>
    );
}

export default MyApp;
