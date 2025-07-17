# Storage Project Roadmap

This document summarises the completed features across the three related repositories and outlines a high level roadmap for future work.

## Completed Features

### storage-server-2
- Node.js/Express GraphQL API for managing media metadata.
- Stores metadata only, with plans for an S3 proxy to handle file storage.
- Unit tests and ESLint linting.

### storage-file-server-2
- Express HTTP API for user management and file uploads to an S3 compatible service.
- `GET /users` and `POST /users` endpoints for listing and creating users.
- `POST /media/upload` endpoint that validates session tokens and uploads files.

### storage-client-2
- React/Next.js front end that communicates with the GraphQL server.
- Supports user authentication, media browsing and file uploads.
- Uses Redux for auth state and an Express proxy for GraphQL requests.

## Roadmap
1. **S3 Proxy Integration**
   - Add a proxy layer to storage-server-2 for uploading and serving media files via S3, using the same MySQL database for metadata.
2. **Unified Authentication**
   - Align the file server with the GraphQL server's authentication model so session tokens work across services.
3. **Additional File Operations**
   - Add download and delete endpoints to storage-file-server-2.
   - Expose file metadata queries for the client.
4. **End-to-End Testing**
   - Implement a comprehensive test suite covering the client and both servers.
5. **Client Enhancements**
   - Provide drag-and-drop uploads, progress indicators and improved media browsing.
6. **Operational Improvements**
   - Centralised logging and structured error responses across all services.
   - Docker-based deployment for a unified stack.

This roadmap aims to evolve the three projects into a cohesive storage platform where the client, GraphQL server and S3 file server work together with shared authentication and consistent APIs.
