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
exports.createWallet = exports.getWallet = exports.listWallets = exports.getWalletTokenBalance = void 0;
const services_1 = require("../services");
const getWalletTokenBalance = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield services_1.circleUserSdk.getWalletTokenBalance(Object.assign({ userToken: req.headers['token'], walletId: req.params.id }, req.query));
        res.status(200).send(response.data);
    }
    catch (error) {
        next(error);
    }
});
exports.getWalletTokenBalance = getWalletTokenBalance;
const listWallets = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield services_1.circleUserSdk.listWallets(Object.assign({ userToken: req.headers['token'] }, req.query));
        res.status(200).send(response.data);
    }
    catch (error) {
        next(error);
    }
});
exports.listWallets = listWallets;
const getWallet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield services_1.circleUserSdk.getWallet({
            userToken: req.headers['token'],
            id: req.params.id
        });
        res.status(200).send(response.data);
    }
    catch (error) {
        next(error);
    }
});
exports.getWallet = getWallet;
const createWallet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const response = yield services_1.circleUserSdk.createWallet({
            blockchains: [req.body.blockchain],
            userToken: req.headers['token']
        });
        res.status(200).send((_a = response.data) === null || _a === void 0 ? void 0 : _a.challengeId);
    }
    catch (error) {
        next(error);
    }
});
exports.createWallet = createWallet;
