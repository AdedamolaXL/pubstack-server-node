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
const transactions_1 = require("../transactions");
const express_1 = require("@jest-mock/express");
jest.mock('../../services', () => ({
    circleUserSdk: {
        listTransactions: jest
            .fn()
            // first mock value
            .mockResolvedValueOnce({
            data: {
                transactions: []
            }
        })
            // second mock value
            .mockRejectedValueOnce(new Error('Expired Token')),
        getTransaction: jest
            .fn()
            // first mock value
            .mockResolvedValueOnce({
            data: {
                transaction: {}
            }
        })
            // second mock value
            .mockRejectedValueOnce(new Error('Expired Token'))
    }
}));
describe('listTransactions', () => {
    test('Should return 200 on successful', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = (0, express_1.getMockReq)({
            headers: { token: 'mockUserToken' }
        });
        const { res, next } = (0, express_1.getMockRes)();
        yield (0, transactions_1.listTransactions)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({
            transactions: []
        });
    }));
    test('Should return 400 on error', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = (0, express_1.getMockReq)({
            headers: { token: 'expiredUserToken' }
        });
        const { res, next } = (0, express_1.getMockRes)();
        yield (0, transactions_1.listTransactions)(req, res, next);
        expect(next).toHaveBeenCalledWith(new Error('Expired Token'));
    }));
});
describe('getTransaction', () => {
    test('Should return 200 on successful', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = (0, express_1.getMockReq)({
            headers: { token: 'mockUserToken' },
            params: { id: 'mockTransactionId' }
        });
        const { res, next } = (0, express_1.getMockRes)();
        yield (0, transactions_1.getTransaction)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({
            transaction: {}
        });
    }));
    test('Should return 400 on error', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = (0, express_1.getMockReq)({
            headers: { token: 'expiredUserToken' },
            params: { id: 'mockTransactionId' }
        });
        const { res, next } = (0, express_1.getMockRes)();
        yield (0, transactions_1.getTransaction)(req, res, next);
        expect(next).toHaveBeenCalledWith(new Error('Expired Token'));
    }));
});
