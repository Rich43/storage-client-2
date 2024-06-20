import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { refreshSession, setAuthState } from './authSlice';

const withTokenRefresh = (WrappedComponent) => {
    return (props) => {
        const dispatch = useDispatch();

        useEffect(() => {
            const token = localStorage.getItem('token');
            if (token) {
                dispatch(setAuthState({ sessionToken: token }));
                dispatch(refreshSession());
            }
        }, [dispatch]);

        return <WrappedComponent {...props} />;
    };
};

export default withTokenRefresh;
