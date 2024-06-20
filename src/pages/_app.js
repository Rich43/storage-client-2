import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import store from '../store';
import client from '../lib/apolloClient';
import '../styles/globals.css';
import withTokenRefresh from "@/features/auth/withTokenRefresh";
import { createTheme, ThemeProvider } from "@mui/material";

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
    const AuthComponent = withTokenRefresh(Component);

    return (
        <Provider store={store}>
            <ApolloProvider client={client}>
                <ThemeProvider theme={theme}>
                    <AuthComponent {...pageProps} />
                </ThemeProvider>
            </ApolloProvider>
        </Provider>
    );
}

export default MyApp;
