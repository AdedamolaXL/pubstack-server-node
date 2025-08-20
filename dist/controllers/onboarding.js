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
exports.signIn = exports.signInCallback = exports.signUp = exports.signUpCallback = void 0;
const crypto_1 = require("crypto");
const services_1 = require("../services");
const bcrypt_1 = require("bcrypt");
const logger_1 = require("../services/logging/logger");
const signUpCallback = (req, res) => function (err, rows) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        if (err) {
            throw err;
        }
        else if (rows.length > 0) {
            // user already signed up
            res.status(201).send({});
        }
        else {
            // user is new
            const newUserId = (0, crypto_1.randomUUID)();
            yield services_1.circleUserSdk.createUser({
                userId: newUserId
            });
            const tokenResponse = yield services_1.circleUserSdk.createUserToken({
                userId: newUserId
            });
            const challengeResponse = yield services_1.circleUserSdk.createUserPinWithWallets({
                userId: newUserId,
                blockchains: ['MATIC-AMOY'],
                accountType: 'SCA'
            });
            // insert User into DB
            services_1.userDAO.insertUser(newUserId, req.body.email, yield (0, bcrypt_1.hash)(req.body.password, 10));
            logger_1.logger.info(`New user inserted into DB, userId: ${newUserId}, email: ${req.body.email}`);
            res.status(200).send({
                userId: newUserId,
                userToken: (_a = tokenResponse.data) === null || _a === void 0 ? void 0 : _a.userToken,
                encryptionKey: (_b = tokenResponse.data) === null || _b === void 0 ? void 0 : _b.encryptionKey,
                challengeId: (_c = challengeResponse.data) === null || _c === void 0 ? void 0 : _c.challengeId
            });
        }
    });
};
exports.signUpCallback = signUpCallback;
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        services_1.userDAO.getUserByEmail(req.body.email, (0, exports.signUpCallback)(req, res));
    }
    catch (error) {
        next(error);
    }
});
exports.signUp = signUp;
const signInCallback = (req, res) => function (err, rows) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        if (err) {
            throw err;
        }
        else if (rows.length > 0) {
            const user = rows[0];
            const passwordMatches = yield (0, bcrypt_1.compare)(req.body.password, user.password);
            if (!passwordMatches) {
                // password invalid
                res.sendStatus(401);
                return;
            }
            // valid credentials
            const tokenResponse = yield services_1.circleUserSdk.createUserToken({
                userId: user.userId
            });
            const userResponse = yield services_1.circleUserSdk.getUser({
                userId: user.userId
            });
            let challengeResponse = undefined;
            if (((_b = (_a = userResponse.data) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.pinStatus) !== 'ENABLED' ||
                ((_d = (_c = userResponse.data) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.securityQuestionStatus) !== 'ENABLED') {
                // when user has not enabled their PIN or security questions yet
                challengeResponse = yield services_1.circleUserSdk.createUserPinWithWallets({
                    userId: user.userId,
                    blockchains: ['MATIC-AMOY'],
                    accountType: 'SCA'
                });
            }
            res.status(200).send({
                userId: user.userId,
                userToken: (_e = tokenResponse.data) === null || _e === void 0 ? void 0 : _e.userToken,
                encryptionKey: (_f = tokenResponse.data) === null || _f === void 0 ? void 0 : _f.encryptionKey,
                challengeId: (_g = challengeResponse === null || challengeResponse === void 0 ? void 0 : challengeResponse.data) === null || _g === void 0 ? void 0 : _g.challengeId
            });
        }
        else {
            // invalid credentials or user does not exist
            res.sendStatus(404);
        }
    });
};
exports.signInCallback = signInCallback;
const signIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        services_1.userDAO.getUserByEmail(req.body.email, (0, exports.signInCallback)(req, res));
    }
    catch (error) {
        next(error);
    }
});
exports.signIn = signIn;
