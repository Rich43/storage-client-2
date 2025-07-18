import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_FILE_SERVER_URL || 'http://localhost:3500';

export async function uploadFile({ sessionToken, mediaId, fileContent, mimeType }) {
    const response = await axios.post(`${BASE_URL}/media/upload`, {
        sessionToken,
        mediaId,
        fileContent,
        mimeType,
    });
    return response.data;
}

export function downloadUrl(mediaId) {
    return `${BASE_URL}/media/${mediaId}/download`;
}

export async function deleteFile(mediaId) {
    await axios.delete(`${BASE_URL}/media/${mediaId}`);
}

export async function fetchMetadata(mediaId) {
    const response = await axios.get(`${BASE_URL}/media/${mediaId}/metadata`);
    return response.data;
}

