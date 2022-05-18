"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_1 = __importDefault(require("../../prisma"));
var utils_1 = require("../../utils");
var totalUnreadResolver = function (_a) {
    var id = _a.id;
    return prisma_1.default.message.count({ where: { roomId: id, unread: true } });
};
var seeRoomsResolver = function (_, __, _a) {
    var loggedInUser = _a.loggedInUser;
    return prisma_1.default.room.findMany({ where: { users: { some: { id: loggedInUser.id } } } });
};
var resolvers = {
    Room: {
        totalUnread: totalUnreadResolver,
    },
    Query: {
        seeRooms: (0, utils_1.protectResolver)(seeRoomsResolver),
    },
};
exports.default = resolvers;
