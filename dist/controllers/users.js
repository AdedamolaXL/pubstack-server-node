"use strict";
// Copyright (c) 2024, Circle Technologies, LLC. All rights reserved.
//
// SPDX-License-Identifier: Apache-2.0
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restorePin = exports.getUser = exports.initializeUser = exports.createUserToken = exports.createUser = void 0;
const crypto_1 = require("crypto");
const services_1 = require("../services");
/* Users circle sdk calls */
const createUser = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUserId = (0, crypto_1.randomUUID)();
        yield services_1.circleUserSdk.createUser({
            userId: newUserId
        });
        res.status(200).send({ userId: newUserId });
    }
    catch (error) {
        next(error);
    }
});
exports.createUser = createUser;
const createUserToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield services_1.circleUserSdk.createUserToken({
            userId: req.body.userId
        });
        res.status(200).send(response.data);
    }
    catch (error) {
        next(error);
    }
});
exports.createUserToken = createUserToken;
const initializeUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const response = yield services_1.circleUserSdk.createUserPinWithWallets({
            userId: req.body.userId,
            blockchains: (_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.blockchains) !== null && _b !== void 0 ? _b : ['MATIC-AMOY'],
            accountType: (_c = req.body) === null || _c === void 0 ? void 0 : _c.accountType
        });
        res.status(200).send(response.data);
    }
    catch (error) {
        next(error);
    }
});
exports.initializeUser = initializeUser;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield services_1.circleUserSdk.getUser({
            userId: req.params.id
        });
        res.status(200).send(response.data);
    }
    catch (error) {
        next(error);
    }
});
exports.getUser = getUser;
const restorePin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield services_1.circleUserSdk.restoreUserPin({
            userToken: req.headers['token']
        });
        res.status(200).send(response.data);
    }
    catch (error) {
        next(error);
    }
});
exports.restorePin = restorePin;
