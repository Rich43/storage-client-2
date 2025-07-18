import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import gql from 'graphql-tag';
import client from '../../lib/apolloClient';

const LOGIN_MUTATION = gql`
    mutation login($username: String!, $password: String!) {
        auth {
            loginUser(username: $username, password: $password) {
                sessionToken
                userId
                sessionId
                username
                avatarPicture
                sessionExpireDateTime
                admin
            }
        }
    }
`;

const REFRESH_SESSION_MUTATION = gql`
    mutation refreshSession {
        auth {
            refreshSession {
                userId
                sessionId
                username
                avatarPicture
                sessionToken
                sessionExpireDateTime
                admin
            }
        }
    }
`;

export const login = createAsyncThunk(
    'auth/login',
    async ({ username, password }, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate({
                mutation: LOGIN_MUTATION,
                variables: { username, password },
            });
            const session = data.auth.loginUser;
            localStorage.setItem('token', session.sessionToken);
            return session;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const refreshSession = createAsyncThunk(
    'auth/refreshSession',
    async (_, { getState, rejectWithValue, dispatch }) => {
        try {
            const token = getState().auth.sessionToken;
            const { data } = await client.mutate({
                mutation: REFRESH_SESSION_MUTATION,
                context: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            });
            const session = data.auth.refreshSession;
            const newToken = session.sessionToken;
            localStorage.setItem('token', newToken);
            dispatch(setAuthState({ sessionToken: newToken }));
            return session;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        sessionToken: null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.sessionToken = null;
            localStorage.removeItem('token');
        },
        setAuthState: (state, action) => {
            state.sessionToken = action.payload.sessionToken;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.sessionToken = action.payload.sessionToken;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(refreshSession.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(refreshSession.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.sessionToken = action.payload.sessionToken;
            })
            .addCase(refreshSession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, setAuthState } = authSlice.actions;

export default authSlice.reducer;
