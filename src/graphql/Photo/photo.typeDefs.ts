import { gql } from "apollo-server-core";

export default gql`
  type Photo {
    id: Int!
    url: String!
    caption: String
    user: User!
    isLiked: Boolean!
    totalLikes: Int!
    totalComments: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    seeFeed(offset: Int): [Photo]
    photoDetail(photoId: Int!): Photo
    seePhotosByUser(userId: Int!): [Photo]
    seePhotosByHashtag(hashtagId: Int!): [Photo]
    seePhotos(offset: Int): [Photo]
  }

  type Mutation {
    createPhoto(file: Upload!, caption: String): MutationRes!
    editPhoto(photoId: Int!, caption: String): MutationRes!
    deletePhoto(photoId: Int!): MutationRes!
    likePhoto(photoId: Int!): MutationRes!
    unlikePhoto(photoId: Int!): MutationRes!
  }
`;
