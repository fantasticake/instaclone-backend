import { gql } from "apollo-server";

export default gql`
  scalar Upload

  type MutationRes {
    ok: Boolean!
    error: String
  }
`;
