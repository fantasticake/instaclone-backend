"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
var apollo_server_core_1 = require("apollo-server-core");
exports["default"] = (0, apollo_server_core_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  scalar Upload\n\n  type MutationRes {\n    ok: Boolean!\n    id: Int\n    error: String\n  }\n"], ["\n  scalar Upload\n\n  type MutationRes {\n    ok: Boolean!\n    id: Int\n    error: String\n  }\n"])));
var templateObject_1;
