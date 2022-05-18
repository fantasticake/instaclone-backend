"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_core_1 = require("apollo-server-core");
exports.default = (0, apollo_server_core_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  type Room {\n    id: Int!\n    users: [User]\n    totalUnread: Int!\n    createdAt: String!\n    updatedAt: String!\n  }\n  type Query {\n    seeRooms: [Room]\n  }\n  type Mutation {\n    exitRoom(roomId: Int!): MutationRes!\n  }\n  type Subscription {\n    roomUpdated(roomId: Int!): Message\n  }\n"], ["\n  type Room {\n    id: Int!\n    users: [User]\n    totalUnread: Int!\n    createdAt: String!\n    updatedAt: String!\n  }\n  type Query {\n    seeRooms: [Room]\n  }\n  type Mutation {\n    exitRoom(roomId: Int!): MutationRes!\n  }\n  type Subscription {\n    roomUpdated(roomId: Int!): Message\n  }\n"])));
var templateObject_1;
