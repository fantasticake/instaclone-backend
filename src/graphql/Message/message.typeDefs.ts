import { gql } from "apollo-server-core";

export default gql`
  type Message {
    id: Int!
    payload: String!
    unread: Boolean!
    user: User!
    createdAt: String!
    updatedAt: String!
  }
  type Query {
    seeMessages(roomId: Int!): [Message]
  }
  type Mutation {
    createMessage(roomId: Int, userId: Int, payload: String!): MutationRes
  }
`;
