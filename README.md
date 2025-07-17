# Storage Client

This project provides a React/Next.js front end for the storage service. It communicates with a GraphQL API and allows users to authenticate, browse existing media and upload new files.

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

type Session {
  userId: Int!
  sessionId: Int!
  username: String!
  avatarPicture: String
  sessionToken: String!
  sessionExpireDateTime: String!
  admin: Boolean!
}

type Media {
  id: Int!
  title: String!
  url: String!
  mimetype: String!
  thumbnail: String
  userId: Int!
  adminOnly: Boolean!
}

type Album {
  id: Int!
  title: String!
  media: [Media]
  userId: Int!
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
  id: Int!
  title: String
  url: String
  mimetype: String
  thumbnail: String
  adminOnly: Boolean
}

type Query {
  login(username: String!, password: String!): Session
  logout: Boolean!
  refreshSession: Session
  listVideos(filter: MediaFilter, pagination: Pagination, sorting: Sorting): [Media]
  listMusic(filter: MediaFilter, pagination: Pagination, sorting: Sorting): [Media]
  listAlbums(filter: MediaFilter, pagination: Pagination, sorting: Sorting): [Album]
  listPictures(filter: MediaFilter, pagination: Pagination, sorting: Sorting): [Media]
  listDocuments(filter: MediaFilter, pagination: Pagination, sorting: Sorting): [Media]
  listOtherFiles(filter: MediaFilter, pagination: Pagination, sorting: Sorting): [Media]
  getMediaById(id: Int!): Media
}

type Mutation {
  createMedia(input: CreateMediaInput!): Media
  editMedia(input: EditMediaInput!): Media
  deleteMedia(id: Int!): Boolean
}
```

