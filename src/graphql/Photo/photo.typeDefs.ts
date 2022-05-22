import { gql } from "apollo-server-core";

export default gql`
  type Photo {
    id: Int!
    url: String!
    caption: String!
    user: User!
    isLiked: Boolean!
    totalLikes: Int!
    totalComments: Int!
    comments: [Comment]
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    seeFeed: [Photo]
    photoDetail(photoId: Int!): Photo
    seePhotosByHashtag(hashtagId: Int!): [Photo]
  }

  type Mutation {
    createPhoto(file: Upload!, caption: String): MutationRes!
    editPhoto(photoId: Int!, caption: String!): MutationRes!
    deletePhoto(photoId: Int!): MutationRes!
    likePhoto(photoId: Int!): MutationRes!
    unlikePhoto(photoId: Int!): MutationRes!
  }
`;
