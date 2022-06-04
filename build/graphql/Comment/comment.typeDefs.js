"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
var apollo_server_core_1 = require("apollo-server-core");
exports["default"] = (0, apollo_server_core_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  type Comment {\n    id: Int!\n    payload: String!\n    user: User!\n    photo: Photo!\n    createdAt: String!\n    updatedAt: String!\n  }\n  type Query {\n    seeComments(photoId: Int!, offset: Int, take: Int): [Comment]\n  }\n  type Mutation {\n    createComment(photoId: Int!, payload: String!): MutationRes!\n    editComment(commentId: Int!, payload: String!): MutationRes!\n    deleteComment(commentId: Int!): MutationRes!\n  }\n"], ["\n  type Comment {\n    id: Int!\n    payload: String!\n    user: User!\n    photo: Photo!\n    createdAt: String!\n    updatedAt: String!\n  }\n  type Query {\n    seeComments(photoId: Int!, offset: Int, take: Int): [Comment]\n  }\n  type Mutation {\n    createComment(photoId: Int!, payload: String!): MutationRes!\n    editComment(commentId: Int!, payload: String!): MutationRes!\n    deleteComment(commentId: Int!): MutationRes!\n  }\n"])));
var templateObject_1;
