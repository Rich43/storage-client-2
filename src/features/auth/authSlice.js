import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import gql from 'graphql-tag';
import client from '../../lib/apolloClient';

const LOGIN_QUERY = gql`
    query login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            sessionToken
            userId
            username
            avatarPicture
            sessionExpireDateTime
            admin
        }
    }
`;

const REFRESH_SESSION_QUERY = gql`
    query refreshSession {
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
`;

export const login = createAsyncThunk(
    'auth/login',
    async ({ username, password }, { rejectWithValue }) => {
        try {
            const { data } = await client.query({
                query: LOGIN_QUERY,
                variables: { username, password },
            });
            localStorage.setItem('token', data.login.sessionToken);
            return data.login;
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
            const { data } = await client.query({
                query: REFRESH_SESSION_QUERY,
                context: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            });
            const newToken = data.refreshSession.sessionToken;
            localStorage.setItem('token', newToken);
            dispatch(setAuthState({ sessionToken: newToken }));
            return data.refreshSession;
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
