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
exports.estimateTransferFee = exports.validateAddress = exports.getTransaction = exports.createTransaction = exports.listTransactions = void 0;
const services_1 = require("../services");
const utils_1 = require("../shared/utils");
const listTransactions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield services_1.circleUserSdk.listTransactions(Object.assign({ userToken: req.headers['token'] }, req.query));
        res.status(200).send(response.data);
    }
    catch (error) {
        next(error);
    }
});
exports.listTransactions = listTransactions;
const createTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feeConfig = (0, utils_1.getFeeConfiguration)(req);
        if (!feeConfig) {
            throw new Error('Invalid fee configuration');
        }
        const response = yield services_1.circleUserSdk.createTransaction({
            userToken: req.headers['token'],
            fee: feeConfig,
            idempotencyKey: req.body.idempotencyKey,
            refId: req.body.refId,
            amounts: req.body.amounts,
            destinationAddress: req.body.destinationAddress,
            nftTokenIds: req.body.nftTokenIds,
            tokenId: req.body.tokenId,
            walletId: req.body.walletId
        });
        res.status(200).send(response.data);
    }
    catch (error) {
        next(error);
    }
});
exports.createTransaction = createTransaction;
const getTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield services_1.circleUserSdk.getTransaction(Object.assign({ userToken: req.headers['token'], id: req.params.id }, req.query));
        res.status(200).send(response.data);
    }
    catch (error) {
        next(error);
    }
});
exports.getTransaction = getTransaction;
const validateAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield services_1.circleUserSdk.validateAddress(Object.assign({}, req.body));
        res.status(200).send(response.data);
    }
    catch (error) {
        next(error);
    }
});
exports.validateAddress = validateAddress;
const estimateTransferFee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield services_1.circleUserSdk.estimateTransferFee(Object.assign({ userToken: req.headers['token'] }, req.body));
        res.status(200).send(response.data);
    }
    catch (error) {
        next(error);
    }
});
exports.estimateTransferFee = estimateTransferFee;
