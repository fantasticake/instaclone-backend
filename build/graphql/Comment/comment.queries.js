"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var prisma_1 = __importDefault(require("../../prisma"));
var seeCommentsResolver = function (_, _a) {
    var photoId = _a.photoId, _b = _a.offset, offset = _b === void 0 ? 0 : _b, _c = _a.take, take = _c === void 0 ? 20 : _c;
    return prisma_1["default"].comment.findMany({
        where: { photoId: photoId },
        include: { user: true },
        skip: offset,
        take: take,
        orderBy: { createdAt: "desc" }
    });
};
var resolvers = {
    Query: {
        seeComments: seeCommentsResolver
    }
};
exports["default"] = resolvers;
