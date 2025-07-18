import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Button, Card, CardContent, CardMedia, Grid, Typography, Tabs, Tab } from '@mui/material';
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

const LIST_MUSIC_QUERY = gql`
    query listMusic($filter: MediaFilter, $pagination: Pagination, $sorting: Sorting) {
        listMusic(filter: $filter, pagination: $pagination, sorting: $sorting) {
            id
            title
            url
            thumbnail
        }
    }
`;

const LIST_PICTURES_QUERY = gql`
    query listPictures($filter: MediaFilter, $pagination: Pagination, $sorting: Sorting) {
        listPictures(filter: $filter, pagination: $pagination, sorting: $sorting) {
            id
            title
            url
            thumbnail
        }
    }
`;

const LIST_DOCUMENTS_QUERY = gql`
    query listDocuments($filter: MediaFilter, $pagination: Pagination, $sorting: Sorting) {
        listDocuments(filter: $filter, pagination: $pagination, sorting: $sorting) {
            id
            title
            url
            thumbnail
        }
    }
`;

const LIST_OTHER_FILES_QUERY = gql`
    query listOtherFiles($filter: MediaFilter, $pagination: Pagination, $sorting: Sorting) {
        listOtherFiles(filter: $filter, pagination: $pagination, sorting: $sorting) {
            id
            title
            url
            thumbnail
        }
    }
`;

const queries = {
    videos: { query: LIST_VIDEOS_QUERY, field: 'listVideos' },
    music: { query: LIST_MUSIC_QUERY, field: 'listMusic' },
    pictures: { query: LIST_PICTURES_QUERY, field: 'listPictures' },
    documents: { query: LIST_DOCUMENTS_QUERY, field: 'listDocuments' },
    other: { query: LIST_OTHER_FILES_QUERY, field: 'listOtherFiles' },
};

function Home() {
    const [category, setCategory] = useState('videos');
    const { query, field } = queries[category];
    const { loading, error, data } = useQuery(query);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <p>Loading...</p>;
    }

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography>Error loading media</Typography>;

    return (
        <div>
            <Navbar />
            <Tabs value={category} onChange={(e, val) => setCategory(val)} centered sx={{ mb: 2 }}>
                <Tab label="Videos" value="videos" />
                <Tab label="Music" value="music" />
                <Tab label="Pictures" value="pictures" />
                <Tab label="Documents" value="documents" />
                <Tab label="Other" value="other" />
            </Tabs>
            <Grid container spacing={2}>
                {data && data[field].map((item) => (
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
