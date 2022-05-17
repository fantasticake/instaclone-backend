import { gql } from "apollo-server";

export default gql`
  type Photo {
    id: Int!
    url: String!
    caption: String!
    hashtags: [Hashtag]
    user: User!
    totalLikes: Int!
    totalComments: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    seeFeed: [Photo]
    photoDetail(photoId: Int!): Photo
    seePhotosByUser(userId: Int!): [Photo]
    seePhotosByHashtag(hashtagId: Int!): [Photo]
  }

  type Mutation {
    createPhoto(file: Upload!, caption: String): Photo
    editPhoto(photoId: Int!, caption: String!): MutationRes
    deletePhoto(photoId: Int!): MutationRes
    likePhoto(photoId: Int!): MutationRes
    unlikePhoto(photoId: Int!): MutationRes
  }
`;
