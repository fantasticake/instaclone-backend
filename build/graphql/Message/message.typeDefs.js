"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_core_1 = require("apollo-server-core");
exports.default = (0, apollo_server_core_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  type Message {\n    id: Int!\n    payload: String!\n    unread: Boolean!\n    user: User!\n    createdAt: String!\n    updatedAt: String!\n  }\n  type Query {\n    seeMessages(roomId: Int!): [Message]\n  }\n  type Mutation {\n    createMessage(roomId: Int, userId: Int, payload: String!): MutationRes!\n    readMessage(messageId: Int!): MutationRes!\n  }\n"], ["\n  type Message {\n    id: Int!\n    payload: String!\n    unread: Boolean!\n    user: User!\n    createdAt: String!\n    updatedAt: String!\n  }\n  type Query {\n    seeMessages(roomId: Int!): [Message]\n  }\n  type Mutation {\n    createMessage(roomId: Int, userId: Int, payload: String!): MutationRes!\n    readMessage(messageId: Int!): MutationRes!\n  }\n"])));
var templateObject_1;
