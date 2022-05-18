"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_express_1 = require("apollo-server-express");
var jwt = __importStar(require("jsonwebtoken"));
var schema_1 = __importDefault(require("./schema"));
var prisma_1 = __importDefault(require("./prisma"));
var express_1 = __importDefault(require("express"));
var graphql_upload_1 = require("graphql-upload");
var http_1 = require("http");
var ws_1 = require("ws");
var apollo_server_core_1 = require("apollo-server-core");
var ws_2 = require("graphql-ws/lib/use/ws");
require("dotenv").config();
var app = (0, express_1.default)();
var httpServer = (0, http_1.createServer)(app);
var wsServer = new ws_1.WebSocketServer({
    server: httpServer,
    path: "/graphql",
});
var serverCleanup = (0, ws_2.useServer)({
    schema: schema_1.default,
    onConnect: function (_a) {
        var connectionParams = _a.connectionParams;
        return __awaiter(void 0, void 0, void 0, function () {
            var decoded, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(connectionParams === null || connectionParams === void 0 ? void 0 : connectionParams.token))
                            return [2 /*return*/, false];
                        if (!(typeof connectionParams.token == "string" && process.env.SECRET_KEY)) return [3 /*break*/, 2];
                        decoded = jwt.verify(connectionParams.token, process.env.SECRET_KEY);
                        if (!(typeof decoded == "object")) return [3 /*break*/, 2];
                        return [4 /*yield*/, prisma_1.default.user.findUnique({
                                where: { id: decoded.userId },
                                select: { id: true },
                            })];
                    case 1:
                        user = _b.sent();
                        if (user)
                            return [2 /*return*/, true];
                        _b.label = 2;
                    case 2: return [2 /*return*/, false];
                }
            });
        });
    },
    context: function (_a) {
        var connectionParams = _a.connectionParams;
        return __awaiter(void 0, void 0, void 0, function () {
            var decoded, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!((connectionParams === null || connectionParams === void 0 ? void 0 : connectionParams.token) &&
                            typeof connectionParams.token == "string" &&
                            process.env.SECRET_KEY)) return [3 /*break*/, 2];
                        decoded = jwt.verify(connectionParams.token, process.env.SECRET_KEY);
                        if (!(typeof decoded == "object")) return [3 /*break*/, 2];
                        return [4 /*yield*/, prisma_1.default.user.findUnique({
                                where: { id: decoded.userId },
                            })];
                    case 1:
                        user = _b.sent();
                        return [2 /*return*/, { loggedInUser: user }];
                    case 2: return [2 /*return*/];
                }
            });
        });
    },
}, wsServer);
var server = new apollo_server_express_1.ApolloServer({
    schema: schema_1.default,
    csrfPrevention: true,
    plugins: [
        (0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({ httpServer: httpServer }),
        {
            serverWillStart: function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, {
                                drainServer: function () {
                                    return __awaiter(this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, serverCleanup.dispose()];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    });
                                },
                            }];
                    });
                });
            },
        },
    ],
    context: function (_a) {
        var req = _a.req;
        return __awaiter(void 0, void 0, void 0, function () {
            var decoded, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(req && typeof req.headers.token == "string" && process.env.SECRET_KEY)) return [3 /*break*/, 2];
                        decoded = jwt.verify(req.headers.token, process.env.SECRET_KEY);
                        if (!(typeof decoded == "object")) return [3 /*break*/, 2];
                        return [4 /*yield*/, prisma_1.default.user.findUnique({
                                where: { id: decoded.userId },
                            })];
                    case 1:
                        user = _b.sent();
                        if (user)
                            return [2 /*return*/, { loggedInUser: user }];
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    },
});
server.start().then(function () {
    app.use((0, graphql_upload_1.graphqlUploadExpress)());
    server.applyMiddleware({ app: app });
    httpServer.listen({ port: process.env.PORT }, function () {
        console.log("\uD83D\uDE80 Server ready at http://localhost:".concat(process.env.PORT).concat(server.graphqlPath));
    });
});
