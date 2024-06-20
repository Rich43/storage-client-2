import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { gql, useLazyQuery } from '@apollo/client';
import { setAuthState } from '../features/auth/authSlice';

const withAuth = (WrappedComponent) => {
    return (props) => {
        const [loading, setLoading] = useState(true);
        const router = useRouter();
        const dispatch = useDispatch();
        const { sessionToken } = useSelector((state) => state.auth);

        const REFRESH_SESSION = gql`
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

        const [refreshSessionQuery, { data }] = useLazyQuery(REFRESH_SESSION, {
            onCompleted: (data) => {
                if (data && data.refreshSession) {
                    dispatch(setAuthState(data.refreshSession));
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
                    await refreshSessionQuery();
                } catch (error) {
                    router.push('/login');
                }
            };
            if (typeof window !== 'undefined') {
                checkAuth();
            }
        }, [refreshSessionQuery, router]);

        if (loading) {
            return <p>Loading...</p>; // or a loading spinner
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
