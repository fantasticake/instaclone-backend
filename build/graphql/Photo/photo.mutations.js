"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var prisma_1 = __importDefault(require("../../prisma"));
var utils_1 = require("../../utils");
var editPhotoResolver = function (_, _a, _b) {
    var photoId = _a.photoId, _c = _a.caption, caption = _c === void 0 ? "" : _c;
    var loggedInUser = _b.loggedInUser;
    return __awaiter(void 0, void 0, void 0, function () {
        var photo, hashtagformats;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!loggedInUser) return [3 /*break*/, 5];
                    return [4 /*yield*/, prisma_1["default"].photo.findFirst({
                            where: { id: photoId, userId: loggedInUser.id },
                            select: { id: true }
                        })];
                case 1:
                    photo = _d.sent();
                    if (!photo) return [3 /*break*/, 4];
                    hashtagformats = (0, utils_1.formatHashtags)(caption);
                    return [4 /*yield*/, prisma_1["default"].photo.update({
                            where: { id: photoId },
                            data: {
                                caption: caption,
                                hashtags: { set: [], connectOrCreate: hashtagformats }
                            }
                        })];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, prisma_1["default"].hashtag.deleteMany({ where: { photos: { none: {} } } })];
                case 3:
                    _d.sent();
                    return [2 /*return*/, { ok: true }];
                case 4: return [2 /*return*/, { ok: false, error: "Photo not found." }];
                case 5: return [2 /*return*/];
            }
        });
    });
};
var deletePhotoResolver = function (_, _a, _b) {
    var photoId = _a.photoId;
    var loggedInUser = _b.loggedInUser;
    return __awaiter(void 0, void 0, void 0, function () {
        var photo;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!loggedInUser) return [3 /*break*/, 7];
                    return [4 /*yield*/, prisma_1["default"].photo.findFirst({
                            where: { id: photoId, userId: loggedInUser.id },
                            select: { id: true, url: true }
                        })];
                case 1:
                    photo = _c.sent();
                    if (!photo) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, utils_1.deleteToAWSS3)(photo.url)];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, prisma_1["default"].comment.deleteMany({ where: { photoId: photoId } })];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, prisma_1["default"].hashtag.deleteMany({ where: { photos: { none: {} } } })];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, prisma_1["default"].photo["delete"]({ where: { id: photoId } })];
                case 5:
                    _c.sent();
                    return [2 /*return*/, { ok: true }];
                case 6: return [2 /*return*/, { ok: false, error: "Photo not found" }];
                case 7: return [2 /*return*/];
            }
        });
    });
};
var resolvers = {
    Mutation: {
        createPhoto: (0, utils_1.protectResolver)(function (_, _a, _b) {
            var file = _a.file, caption = _a.caption;
            var loggedInUser = _b.loggedInUser;
            return __awaiter(void 0, void 0, void 0, function () {
                var hashtagformats, url, photo;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!loggedInUser) return [3 /*break*/, 3];
                            hashtagformats = (0, utils_1.formatHashtags)(caption);
                            return [4 /*yield*/, (0, utils_1.uploadToAWSS3)(file, loggedInUser.id, "photos")];
                        case 1:
                            url = _c.sent();
                            return [4 /*yield*/, prisma_1["default"].photo.create({
                                    data: __assign({ url: url, user: { connect: { id: loggedInUser.id } } }, (caption && {
                                        caption: caption,
                                        hashtags: {
                                            connectOrCreate: hashtagformats
                                        }
                                    }))
                                })];
                        case 2:
                            photo = _c.sent();
                            return [2 /*return*/, { ok: true, id: photo.id }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }),
        editPhoto: (0, utils_1.protectResolver)(editPhotoResolver),
        deletePhoto: (0, utils_1.protectResolver)(deletePhotoResolver),
        likePhoto: (0, utils_1.protectResolver)(function (_, _a, _b) {
            var photoId = _a.photoId;
            var loggedInUser = _b.loggedInUser;
            return __awaiter(void 0, void 0, void 0, function () {
                var photo;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!loggedInUser) return [3 /*break*/, 4];
                            return [4 /*yield*/, prisma_1["default"].photo.findFirst({
                                    where: {
                                        AND: [
                                            { id: photoId },
                                            { likeUsers: { none: { id: loggedInUser.id } } },
                                        ]
                                    },
                                    select: { id: true }
                                })];
                        case 1:
                            photo = _c.sent();
                            if (!photo) return [3 /*break*/, 3];
                            return [4 /*yield*/, prisma_1["default"].user.update({
                                    where: { id: loggedInUser.id },
                                    data: { likePhotos: { connect: { id: photoId } } }
                                })];
                        case 2:
                            _c.sent();
                            return [2 /*return*/, { ok: true }];
                        case 3: return [2 /*return*/, { ok: false, error: "Photo not found." }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }),
        unlikePhoto: (0, utils_1.protectResolver)(function (_, _a, _b) {
            var photoId = _a.photoId;
            var loggedInUser = _b.loggedInUser;
            return __awaiter(void 0, void 0, void 0, function () {
                var photo;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!loggedInUser) return [3 /*break*/, 4];
                            return [4 /*yield*/, prisma_1["default"].photo.findFirst({
                                    where: {
                                        AND: [
                                            { id: photoId },
                                            { likeUsers: { some: { id: loggedInUser.id } } },
                                        ]
                                    },
                                    select: { id: true }
                                })];
                        case 1:
                            photo = _c.sent();
                            if (!photo) return [3 /*break*/, 3];
                            return [4 /*yield*/, prisma_1["default"].user.update({
                                    where: { id: loggedInUser.id },
                                    data: { likePhotos: { disconnect: { id: photoId } } }
                                })];
                        case 2:
                            _c.sent();
                            return [2 /*return*/, { ok: true }];
                        case 3: return [2 /*return*/, { ok: false, error: "Photo not found." }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        })
    }
};
exports["default"] = resolvers;
