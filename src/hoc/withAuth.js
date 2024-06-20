import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';

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

const withAuth = (WrappedComponent) => {
    return (props) => {
        const [loading, setLoading] = useState(true);
        const router = useRouter();
        const { data, error, refetch } = useQuery(REFRESH_SESSION);

        useEffect(() => {
            const checkAuth = async () => {
                try {
                    const { data } = await refetch();
                    if (data && data.refreshSession) {
                        localStorage.setItem('token', data.refreshSession.sessionToken);
                        setLoading(false);
                    } else {
                        await router.push('/login');
                    }
                } catch (error) {
                    await router.push('/login');
                }
            };
            checkAuth().then(r => {});
        }, [refetch, router]);

        if (loading) {
            return <p>Loading...</p>; // or a loading spinner
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
