import { gql } from "apollo-server-core";

export default gql`
  type Comment {
    id: Int!
    payload: String!
    user: User!
    createdAt: String!
    updatedAt: String!
  }
  type Query {
    seeComments(photoId: Int!): [Comment]
  }
  type Mutation {
    createComment(photoId: Int!, payload: String!): MutationRes
    editComment(commentId: Int!, payload: String!): MutationRes
    deleteComment(commentId: Int!): MutationRes!
  }
`;
