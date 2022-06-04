"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var prisma_1 = __importDefault(require("../../prisma"));
var utils_1 = require("../../utils");
var totalUnreadResolver = function (_a) {
    var id = _a.id;
    return prisma_1["default"].message.count({ where: { roomId: id, unread: true } });
};
var seeRoomsResolver = function (_, __, _a) {
    var loggedInUser = _a.loggedInUser;
    return prisma_1["default"].room.findMany({
        where: { users: { some: { id: loggedInUser.id } } },
        include: { users: true }
    });
};
var seeRoomResolver = function (_, _a, _b) {
    var roomId = _a.roomId;
    var loggedInUser = _b.loggedInUser;
    var room = prisma_1["default"].room.findFirst({
        where: { id: roomId, users: { some: { id: loggedInUser.id } } },
        include: { users: true }
    });
    if (room) {
        return room;
    }
    return null;
};
var resolvers = {
    Room: {
        totalUnread: totalUnreadResolver
    },
    Query: {
        seeRooms: (0, utils_1.protectResolver)(seeRoomsResolver),
        seeRoom: (0, utils_1.protectResolver)(seeRoomResolver)
    }
};
exports["default"] = resolvers;
