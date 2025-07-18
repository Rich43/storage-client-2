# Storage Client

This project provides a React/Next.js front end for the storage service. It communicates with a GraphQL API and allows users to authenticate, browse existing media and upload new files.
The related REST API used for storing raw files is documented in `docs/FILE_SERVER_PROTOCOL.md`.

## Requirements

- Node.js 18 or newer
- A running GraphQL server at `http://localhost:4000/graphql` (not included in this repository)

## Installation

Install dependencies with npm:

```bash
npm install
```

## Running the application

Start the GraphQL backend, then run the development server:

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000). GraphQL requests are proxied to `http://localhost:4000/graphql` as configured in `next.config.mjs`.

### File server

Raw file data is handled by the separate `storage-file-server-2` REST API. By default the client expects this service to run at `http://localhost:3500`. Set `NEXT_PUBLIC_FILE_SERVER_URL` to override the URL if required.

Uploading a file happens in two steps:

1. A media record is created through the GraphQL mutation `createMedia`.
2. The selected file is sent to `POST /media/upload` with the user's `sessionToken` and the created `mediaId` as described in `docs/FILE_SERVER_PROTOCOL.md`.

Files are downloaded via `GET /media/:id/download`.

To build for production run:

```bash
npm run build
npm start
```

## Project structure

- `src/pages` – Next.js pages such as `login`, `upload` and media listings
- `src/components` – shared React components
- `src/features` – Redux logic for authentication and token refresh
- `schema.graphql` – GraphQL schema used by the client (described below)

## Protocol

The client uses the following GraphQL schema to communicate with the storage service:

```graphql
schema {
    query: Query
    mutation: Mutation
}

enum Category {
    IMAGE
    VIDEO
    AUDIO
    DOCUMENT
    OTHER
}

type User {
    id: ID!
    username: String!
    email: String!
    avatar: Media
    created: String!
    updated: String
    activated: Boolean!
    banned: Boolean!
    likedMedia: [LikeDislike!]!
    dislikedMedia: [LikeDislike!]!
}

input EditUserInput {
    id: ID!
    username: String
    email: String
    password: String
}

input RegisterUserInput {
    username: String!
    email: String!
    password: String!
}

type MimeType {
    id: ID!
    type: String!
    category: Category!
    extensions: [String]
    preferred_extension: String!
}

input MimeTypeFilter {
    type: String
    category: Category
    extension: String
    preferred_extension: String
}

type Session {
    userId: ID!
    sessionId: ID!
    user: User!
    avatarPicture: String
    sessionToken: String!
    sessionExpireDateTime: String!
    admin: Boolean!
    created: String!
    updated: String
}

enum LikeDislikeAction {
    LIKE
    DISLIKE
}

type Media {
    id: ID!
    title: String!
    description: String
    url: String!
    mimetype: String!
    thumbnail: Media
    userId: ID!
    adminOnly: Boolean!
    uploaded: Boolean!
    uploadedDate: String
    created: String!
    updated: String
    fileSize: Int!
    view_count: Int!
    likes: Int!
    dislikes: Int!
}

type MediaComment {
    id: ID!
    mediaId: ID!
    userId: ID!
    comment: String!
    created: String!
    updated: String!
}

type LikeDislike {
    id: ID!
    userId: ID!
    mediaId: ID!
    action: LikeDislikeAction!
    createdAt: String!
    updatedAt: String!
}

input CreateLikeDislikeInput {
    mediaId: ID!
    action: LikeDislikeAction!
}

input UpdateLikeDislikeInput {
    id: ID!
    action: LikeDislikeAction!
}

type Album {
    id: ID!
    title: String!
    media: [Media]
    userId: ID!
    created: String!
    updated: String
}

input MediaFilter {
    title: String
    mimetype: String
    userId: Int
}

input Pagination {
    page: Int!
    limit: Int!
}

input Sorting {
    field: String!
    order: String!
}

input CreateMediaInput {
    title: String!
    url: String!
    mimetype: String!
    thumbnail: String
    adminOnly: Boolean
}

input EditMediaInput {
    id: ID!
    title: String
    description: String
    url: String
    mimetype: String
    thumbnail: String
    adminOnly: Boolean
}

input CreateMediaCommentInput {
    mediaId: ID!
    comment: String!
}

input EditMediaCommentInput {
    id: ID!
    comment: String!
}

type Query {
    lists: ListQueries
    gets: GetQueries
}

type ListQueries {
    listAlbums(
        albumTitleFilter: String
        pagination: Pagination
        sorting: Sorting
    ): [Album]
    listDocuments(
        filter: MediaFilter
        pagination: Pagination
        sorting: Sorting
    ): [Media]
    listMedia(
        filter: MediaFilter
        pagination: Pagination
        sorting: Sorting
    ): [Media]
    listMediaComments(mediaId: ID!): [MediaComment]
    listMimeTypes(
        filter: MimeTypeFilter
        pagination: Pagination
        sorting: Sorting
    ): [MimeType]
    listMusic(
        filter: MediaFilter
        pagination: Pagination
        sorting: Sorting
    ): [Media]
    listOtherFiles(
        filter: MediaFilter
        pagination: Pagination
        sorting: Sorting
    ): [Media]
    listPictures(
        filter: MediaFilter
        pagination: Pagination
        sorting: Sorting
    ): [Media]
    listRelatedMedia(id: ID!): [Media]
    listVideos(
        filter: MediaFilter
        pagination: Pagination
        sorting: Sorting
    ): [Media]
}

type GetQueries {
    getDislikesByUser(userId: ID!): [LikeDislike!]!
    getLikesByUser(userId: ID!): [LikeDislike!]!
    getMediaById(id: ID!): Media
}

type Mutation {
    media: MediaMutations
    auth: AuthMutations
    likes: LikeMutations
}

type MediaMutations {
    createMedia(input: CreateMediaInput!): Media!
    editMedia(input: EditMediaInput!): Media!
    deleteMedia(id: ID!): Boolean!
    createMediaComment(input: CreateMediaCommentInput!): MediaComment!
    editMediaComment(input: EditMediaCommentInput!): MediaComment!
    deleteMediaComment(id: ID!): Boolean!
}

type AuthMutations {
    loginUser(username: String!, password: String!): Session
    logoutUser: Boolean!
    refreshSession: Session
    registerUser(input: RegisterUserInput!): User!
    activateUser(activationCode: String!): Boolean!
    editUser(input: EditUserInput!): User!
    setAvatar(mediaId: ID!): User!
}

type LikeMutations {
    createLikeDislike(input: CreateLikeDislikeInput!): LikeDislike!
    updateLikeDislike(input: UpdateLikeDislikeInput!): LikeDislike!
    deleteLikeDislike(id: ID!): Boolean!
}
```

