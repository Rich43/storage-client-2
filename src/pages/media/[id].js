import React from 'react';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import { Button, Container, Typography } from '@mui/material';
import Navbar from '../../components/Navbar';

const GET_MEDIA_BY_ID_QUERY = gql`
    query getMediaById($id: Int!) {
        getMediaById(id: $id) {
            id
            title
            url
            mimetype
            thumbnail
        }
    }
`;

function MediaDetails() {
    const router = useRouter();
    const { id } = router.query;
    const { loading, error, data } = useQuery(GET_MEDIA_BY_ID_QUERY, {
        variables: { id: parseInt(id) }
    });

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography>Error loading media</Typography>;

    const media = data.getMediaById;

    return (
        <div>
            <Navbar />
            <Container>
                <Typography variant="h4" gutterBottom>{media.title}</Typography>
                {media.mimetype.startsWith('video/') && (
                    <video width="100%" controls>
                        <source src={media.url} type={media.mimetype} />
                        Your browser does not support the video tag.
                    </video>
                )}
                {media.mimetype.startsWith('audio/') && (
                    <audio controls>
                        <source src={media.url} type={media.mimetype} />
                        Your browser does not support the audio element.
                    </audio>
                )}
                {!media.mimetype.startsWith('video/') && !media.mimetype.startsWith('audio/') && (
                    <Button variant="contained" color="primary" href={media.url} download>
                        Download
                    </Button>
                )}
            </Container>
        </div>
    );
}

export default MediaDetails;
