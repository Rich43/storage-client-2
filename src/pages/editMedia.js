import React, { useEffect, useState } from 'react';
import {
    Button,
    Container,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

const GET_MEDIA_BY_ID_QUERY = gql`
    query getMediaById($id: Int!) {
        getMediaById(id: $id) {
            id
            title
            url
            mimetype
            thumbnail
            adminOnly
        }
    }
`;

const EDIT_MEDIA_MUTATION = gql`
    mutation editMedia($input: EditMediaInput!) {
        editMedia(input: $input) {
            id
        }
    }
`;

function EditMedia() {
    const router = useRouter();
    const { id } = router.query;
    const { loading, error, data } = useQuery(GET_MEDIA_BY_ID_QUERY, {
        variables: { id: parseInt(id) },
    });
    const [editMedia] = useMutation(EDIT_MEDIA_MUTATION);

    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [mimetype, setMimetype] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [adminOnly, setAdminOnly] = useState(false);

    useEffect(() => {
        if (data) {
            const media = data.getMediaById;
            setTitle(media.title);
            setUrl(media.url);
            setMimetype(media.mimetype);
            setThumbnail(media.thumbnail);
            setAdminOnly(media.adminOnly);
        }
    }, [data]);

    const handleEdit = async () => {
        try {
            await editMedia({
                variables: {
                    input: {
                        id: parseInt(id),
                        title,
                        url,
                        mimetype,
                        thumbnail,
                        adminOnly,
                    },
                },
            });
            alert('Media updated successfully');
            router.push('/');
        } catch (error) {
            console.error('Edit failed', error);
            alert('Failed to edit media');
        }
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography>Error loading media</Typography>;

    return (
        <div>
            <Navbar />
            <Container maxWidth="sm">
                <Typography variant="h4" gutterBottom>
                    Edit Media
                </Typography>
                <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Mimetype</InputLabel>
                    <Select
                        value={mimetype}
                        onChange={(e) => setMimetype(e.target.value)}
                    >
                        <MenuItem value="image/jpeg">Image (JPEG)</MenuItem>
                        <MenuItem value="image/png">Image (PNG)</MenuItem>
                        <MenuItem value="video/mp4">Video (MP4)</MenuItem>
                        <MenuItem value="audio/mp3">Audio (MP3)</MenuItem>
                        <MenuItem value="application/pdf">Document (PDF)</MenuItem>
                        <MenuItem value="application/zip">Archive (ZIP)</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Thumbnail URL"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={adminOnly}
                            onChange={(e) => setAdminOnly(e.target.checked)}
                            color="primary"
                        />
                    }
                    label="Admin Only"
                />
                <Button variant="contained" color="primary" onClick={handleEdit}>
                    Save Changes
                </Button>
            </Container>
        </div>
    );
}

export default EditMedia;
