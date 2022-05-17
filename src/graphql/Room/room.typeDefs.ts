import { gql } from "apollo-server-core";

export default gql`
  type Room {
    id: Int!
    users: [User]
    totalUnread: Int!
    createdAt: String!
    updatedAt: String!
  }
  type Query {
    seeRooms: [Room]
  }
  type Mutation {
    exitRoom(roomId: Int!): MutationRes!
  }
  type Subscription {
    roomUpdated(roomId: Int!): Message
  }
`;
