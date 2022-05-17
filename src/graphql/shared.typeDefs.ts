import { gql } from "apollo-server-core";

export default gql`
  scalar Upload

  type MutationRes {
    ok: Boolean!
    error: String
  }
`;
