import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { gql, useMutation } from '@apollo/client';
import { setAuthState } from '../features/auth/authSlice';

const withAuth = (WrappedComponent) => {
    const Component = (props) => {
        const [loading, setLoading] = useState(true);
        const router = useRouter();
        const dispatch = useDispatch();
        const { sessionToken } = useSelector((state) => state.auth);

        const REFRESH_SESSION = gql`
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

        const [refreshSessionMutation, { data }] = useMutation(REFRESH_SESSION, {
            onCompleted: (data) => {
                if (data && data.auth && data.auth.refreshSession) {
                    dispatch(setAuthState(data.auth.refreshSession));
                    setLoading(false);
                } else {
                    router.push('/login');
                }
            },
        });

        useEffect(() => {
            const checkAuth = async () => {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }
                try {
                    await refreshSessionMutation();
                } catch (error) {
                    router.push('/login');
                }
            };
            if (typeof window !== 'undefined') {
                checkAuth();
            }
        }, [refreshSessionMutation, router]);

        if (loading) {
            return <p>Loading...</p>; // or a loading spinner
        }

        return <WrappedComponent {...props} />;
    };
    Component.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    return Component;
};

export default withAuth;
