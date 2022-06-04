"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var prisma_1 = __importDefault(require("../../prisma"));
var utils_1 = require("../../utils");
var seeMessagesResolver = function (_, _a, _b) {
    var roomId = _a.roomId;
    var loggedInUser = _b.loggedInUser;
    return prisma_1["default"].message.findMany({
        where: { roomId: roomId, room: { users: { some: { id: loggedInUser.id } } } },
        include: { user: true },
        orderBy: { createdAt: "desc" }
    });
};
var resolvers = {
    Query: {
        seeMessages: (0, utils_1.protectResolver)(seeMessagesResolver)
    }
};
exports["default"] = resolvers;
