import { gql } from "apollo-server-core";

export default gql`
  type Comment {
    id: Int!
    payload: String!
    user: User!
    photo: Photo!
    createdAt: String!
    updatedAt: String!
  }
  type Query {
    seeComments(photoId: Int!, offset: Int, take: Int): [Comment]
  }
  type Mutation {
    createComment(photoId: Int!, payload: String!): MutationRes!
    editComment(commentId: Int!, payload: String!): MutationRes!
    deleteComment(commentId: Int!): MutationRes!
  }
`;
