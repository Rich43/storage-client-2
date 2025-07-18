# File Server Protocol

This document summarises the HTTP API exposed by the [storage-file-server-2](https://github.com/Rich43/storage-file-server-2) project. The server provides a minimal REST interface for user management and for storing raw files in an S3 compatible bucket. It is designed to be used alongside this client and the related GraphQL API.

## Environment

The server reads configuration from a `.env` file with at least the following variables:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=storage
AWS_ACCESS_KEY_ID=<access-key>
AWS_SECRET_ACCESS_KEY=<secret-key>
MINIO_ENDPOINT=http://localhost:9000
AWS_BUCKET_NAME=storage
PORT=3500
```

`PORT` defaults to `3500` when not set.

## Endpoints

### `GET /users`
Returns a JSON array of user records stored in MySQL.

### `POST /users`
Creates a new user. The request body should contain fields matching the `user` table columns. On success the created user object is returned with status `201`.

### `POST /media/upload`
Uploads raw file data directly to the configured S3 bucket. The JSON body must provide:

```json
{
  "sessionToken": "string",
  "mediaId": 123,
  "fileContent": "Base64 encoded content",
  "mimeType": "image/png"
}
```

`sessionToken` must exist in the `session` table and `mediaId` must reference a row in the `media` table. The file is uploaded to S3 at the key stored in `media.url`. The response contains the S3 upload result, e.g.:

```json
{
  "Location": "http://localhost:9000/storage/path/file.png",
  "Bucket": "storage",
  "Key": "path/file.png",
  "ETag": "\"abc123\""
}
```

### `GET /media/:id/download`
Downloads the raw file associated with a media record. The file is streamed with the content type returned by S3.

### `DELETE /media/:id`
Deletes the file from S3. Responds with status `204` when successful.

### `GET /media/:id/metadata`
Returns an object with both the database record and the S3 metadata for the file.

```
{
  "db": { /* fields from the `media` table */ },
  "s3": { /* response from S3 headObject */ }
}
```

## Development

Run `npm start` in the server repository to launch the API. Requests are served on the configured port (default `3500`). Code is reloaded automatically via `nodemon`.
