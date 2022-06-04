"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var prisma_1 = __importDefault(require("../../prisma"));
var searchHashtagsResolver = function (_, _a) {
    var key = _a.key;
    return prisma_1["default"].hashtag.findMany({ where: { hashtag: { startsWith: key } } });
};
var resolvers = {
    Query: {
        searchHashtags: searchHashtagsResolver
    }
};
exports["default"] = resolvers;
