import { gql } from "apollo-server-core";

export default gql`
  type Hashtag {
    id: Int!
    hashtag: String!
    createdAt: String!
    updatedAt: String!
  }
  type Query {
    searchHashtags(key: String!): [Hashtag]
  }
`;
