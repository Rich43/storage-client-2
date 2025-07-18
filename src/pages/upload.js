import React, { useState } from 'react';
import {
    Button,
    CircularProgress,
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
import { gql, useMutation } from '@apollo/client';
import { useSelector } from 'react-redux';
import { uploadFile } from '../lib/fileServerApi';
import Navbar from '../components/Navbar';

const CREATE_MEDIA_MUTATION = gql`
    mutation createMedia($input: CreateMediaInput!) {
        media {
            createMedia(input: $input) {
                id
            }
        }
    }
`;

function UploadMedia() {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [mimetype, setMimetype] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [adminOnly, setAdminOnly] = useState(false);
    const [file, setFile] = useState(null);
    const { sessionToken } = useSelector((state) => state.auth);
    const [createMedia, { loading }] = useMutation(CREATE_MEDIA_MUTATION);

    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
        });

    const handleUpload = async () => {
        try {
            const { data } = await createMedia({
                variables: {
                    input: {
                        title,
                        url,
                        mimetype,
                        thumbnail,
                        adminOnly,
                    },
                },
            });
            const mediaId = data.media.createMedia.id;
            if (file) {
                const fileContent = await toBase64(file);
                await uploadFile({
                    sessionToken,
                    mediaId,
                    fileContent,
                    mimeType: mimetype,
                });
            }
            alert('Media uploaded successfully');
        } catch (error) {
            console.error('Upload failed', error);
            alert('Failed to upload media');
        }
    };

    return (
        <div>
            <Navbar />
            <Container maxWidth="sm">
                <Typography variant="h4" gutterBottom>
                    Upload Media
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
                <Button variant="outlined" component="label" sx={{ mt: 2 }}>
                    Select File
                    <input
                        type="file"
                        hidden
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </Button>
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
                <Button variant="contained" color="primary" onClick={handleUpload} disabled={loading}>
                    {loading ? 'Uploading...' : 'Upload'}
                </Button>
                {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
            </Container>
        </div>
    );
}

export default UploadMedia;
