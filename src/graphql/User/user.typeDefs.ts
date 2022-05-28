import { gql } from "apollo-server-core";

export default gql`
  type User {
    id: Int!
    username: String!
    email: String
    avatar: String
    isFollowing: Boolean!
    totalPosts: Int!
    totalFollowing: Int!
    totalFollowers: Int!
    createdAt: String!
    updatedAt: String!
  }
  type LoginRes {
    ok: Boolean!
    error: String
    token: String
  }
  type Query {
    seeFollowing(userId: Int!): [User]
    seeFollowers(userId: Int!): [User]
    seeLikeUsers(photoId: Int!): [User]
    seeProfile(userId: Int!): User
    seeMe: User
    searchUsers(key: String!): [User]
  }
  type Mutation {
    signUp(username: String!, email: String!, password: String!): MutationRes!
    login(username: String!, password: String!): LoginRes!
    editProfile(email: String, avatar: Upload): MutationRes!
    deleteAccount: MutationRes!
    follow(userId: Int!): MutationRes!
    unfollow(userId: Int!): MutationRes!
  }
`;
