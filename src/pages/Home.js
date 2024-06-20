import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Button, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import withAuth from '../hoc/withAuth';

const LIST_VIDEOS_QUERY = gql`
    query listVideos($filter: MediaFilter, $pagination: Pagination, $sorting: Sorting) {
        listVideos(filter: $filter, pagination: $pagination, sorting: $sorting) {
            id
            title
            url
            thumbnail
        }
    }
`;

function Home() {
    const { loading, error, data } = useQuery(LIST_VIDEOS_QUERY);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <p>Loading...</p>;
    }

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography>Error loading videos</Typography>;

    return (
        <div>
            <Navbar />
            <Grid container spacing={2}>
                {data.listVideos.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="140"
                                image={item.thumbnail}
                                alt={item.title}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {item.title}
                                </Typography>
                                <Link href={`/media/${item.id}`} passHref>
                                    <Button variant="contained" color="primary">
                                        View
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default withAuth(Home);
