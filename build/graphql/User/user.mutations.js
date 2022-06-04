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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var jwt = __importStar(require("jsonwebtoken"));
var bcrypt = __importStar(require("bcrypt"));
var utils_1 = require("../../utils");
require("dotenv").config();
var signUpResolver = function (_, _a) {
    var username = _a.username, email = _a.email, password = _a.password;
    return __awaiter(void 0, void 0, void 0, function () {
        var existingUser, hashed;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, prisma_1["default"].user.findFirst({
                        where: { OR: [{ username: username }, { email: email }] },
                        select: { id: true }
                    })];
                case 1:
                    existingUser = _b.sent();
                    if (existingUser)
                        return [2 /*return*/, {
                                ok: false,
                                error: "Username or Email already exists."
                            }];
                    hashed = bcrypt.hashSync(password, 10);
                    return [4 /*yield*/, prisma_1["default"].user.create({
                            data: { username: username, email: email, password: hashed }
                        })];
                case 2:
                    _b.sent();
                    return [2 /*return*/, {
                            ok: true
                        }];
            }
        });
    });
};
var loginResolver = function (_, _a) {
    var username = _a.username, password = _a.password;
    return __awaiter(void 0, void 0, void 0, function () {
        var user, token, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, prisma_1["default"].user.findUnique({
                            where: { username: username },
                            select: { id: true, password: true }
                        })];
                case 1:
                    user = _b.sent();
                    if (user) {
                        if (bcrypt.compareSync(password, user.password) &&
                            process.env.SECRET_KEY) {
                            token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
                            return [2 /*return*/, { ok: true, token: token }];
                        }
                        return [2 /*return*/, { ok: false, error: "login failed" }];
                    }
                    return [2 /*return*/, { ok: false, error: "username not found" }];
                case 2:
                    error_1 = _b.sent();
                    return [2 /*return*/, { ok: false, error: error_1 }];
                case 3: return [2 /*return*/];
            }
        });
    });
};
var editProfileResolver = function (_, _a, _b) {
    var email = _a.email, avatar = _a.avatar;
    var loggedInUser = _b.loggedInUser;
    return __awaiter(void 0, void 0, void 0, function () {
        var avatarUrl, user;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!avatar) return [3 /*break*/, 3];
                    return [4 /*yield*/, prisma_1["default"].user.findUnique({
                            where: { id: loggedInUser.id },
                            select: { avatar: true }
                        })];
                case 1:
                    user = _c.sent();
                    if (user && user.avatar)
                        (0, utils_1.deleteToAWSS3)(user.avatar);
                    return [4 /*yield*/, (0, utils_1.uploadToAWSS3)(avatar, loggedInUser.id, "avatars")];
                case 2:
                    avatarUrl = _c.sent();
                    _c.label = 3;
                case 3: return [4 /*yield*/, prisma_1["default"].user.update({
                        where: { id: loggedInUser.id },
                        data: __assign(__assign({}, (email && { email: email })), (avatar && { avatar: avatarUrl }))
                    })];
                case 4:
                    _c.sent();
                    return [2 /*return*/, { ok: true }];
            }
        });
    });
};
var deleteAccountResolver = function (_, __, _a) {
    var loggedInUser = _a.loggedInUser;
    return __awaiter(void 0, void 0, void 0, function () {
        var photos;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (loggedInUser.avatar)
                        (0, utils_1.deleteToAWSS3)(loggedInUser.avatar);
                    return [4 /*yield*/, prisma_1["default"].photo.findMany({
                            where: { userId: loggedInUser.id },
                            select: { id: true, url: true }
                        })];
                case 1:
                    photos = _b.sent();
                    photos.forEach(function (photo) { return (0, utils_1.deleteToAWSS3)(photo.url); });
                    photos.forEach(function (photo) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, prisma_1["default"].comment.deleteMany({
                                        where: { photoId: photo.id }
                                    })];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); });
                    return [4 /*yield*/, prisma_1["default"].comment.deleteMany({
                            where: { userId: loggedInUser.id }
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, prisma_1["default"].photo.deleteMany({
                            where: { userId: loggedInUser.id }
                        })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, prisma_1["default"].message.deleteMany({
                            where: { userId: loggedInUser.id }
                        })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, prisma_1["default"].room.deleteMany({
                            where: { users: { some: { id: loggedInUser.id } } }
                        })];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, prisma_1["default"].user["delete"]({ where: { id: loggedInUser.id } })];
                case 6:
                    _b.sent();
                    return [2 /*return*/, { ok: true }];
            }
        });
    });
};
var followResolver = function (_, _a, _b) {
    var userId = _a.userId;
    var loggedInUser = _b.loggedInUser;
    return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, prisma_1["default"].user.findUnique({
                        where: { id: userId },
                        select: { id: true }
                    })];
                case 1:
                    user = _c.sent();
                    if (!user) return [3 /*break*/, 3];
                    return [4 /*yield*/, prisma_1["default"].user.update({
                            where: { id: loggedInUser.id },
                            data: { following: { connect: { id: userId } } }
                        })];
                case 2:
                    _c.sent();
                    return [2 /*return*/, { ok: true }];
                case 3: return [2 /*return*/, {
                        ok: false,
                        error: "user not found"
                    }];
            }
        });
    });
};
var unfollowResolver = function (_, _a, _b) {
    var userId = _a.userId;
    var loggedInUser = _b.loggedInUser;
    return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, prisma_1["default"].user.findFirst({
                        where: { id: userId, followers: { some: { id: loggedInUser.id } } },
                        select: { id: true }
                    })];
                case 1:
                    user = _c.sent();
                    if (!user) return [3 /*break*/, 3];
                    return [4 /*yield*/, prisma_1["default"].user.update({
                            where: { id: loggedInUser.id },
                            data: { following: { disconnect: { id: userId } } }
                        })];
                case 2:
                    _c.sent();
                    return [2 /*return*/, { ok: true }];
                case 3: return [2 /*return*/, {
                        ok: false,
                        error: "user not found"
                    }];
            }
        });
    });
};
var resolvers = {
    Mutation: {
        signUp: signUpResolver,
        login: loginResolver,
        editProfile: (0, utils_1.protectResolver)(editProfileResolver),
        deleteAccount: (0, utils_1.protectResolver)(deleteAccountResolver),
        follow: (0, utils_1.protectResolver)(followResolver),
        unfollow: (0, utils_1.protectResolver)(unfollowResolver)
    }
};
exports["default"] = resolvers;
