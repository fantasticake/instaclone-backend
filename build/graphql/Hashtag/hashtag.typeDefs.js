"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
var apollo_server_core_1 = require("apollo-server-core");
exports["default"] = (0, apollo_server_core_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  type Hashtag {\n    id: Int!\n    hashtag: String!\n    createdAt: String!\n    updatedAt: String!\n  }\n  type Query {\n    searchHashtags(key: String!): [Hashtag]\n  }\n"], ["\n  type Hashtag {\n    id: Int!\n    hashtag: String!\n    createdAt: String!\n    updatedAt: String!\n  }\n  type Query {\n    searchHashtags(key: String!): [Hashtag]\n  }\n"])));
var templateObject_1;
