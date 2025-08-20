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
const onboarding_1 = require("../onboarding");
const express_1 = require("@jest-mock/express");
const bcrypt_1 = require("bcrypt");
const logger_1 = require("../../services/logging/logger");
jest.mock('../../services', () => ({
    circleUserSdk: {
        createUser: jest
            .fn()
            // first mock value
            .mockResolvedValueOnce({})
            // second mock value
            .mockRejectedValueOnce(new Error('Error occurred')),
        createUserToken: jest
            .fn()
            // first mock value
            .mockResolvedValue({
            data: {
                userToken: 'mockUserToken',
                encryptionKey: 'mockEncryptionKey'
            }
        }),
        createUserPinWithWallets: jest
            .fn()
            // first mock value
            .mockResolvedValueOnce({
            data: {
                challengeId: 'mockChallengeId'
            }
        })
            // second mock value
            .mockRejectedValueOnce(new Error('Invalid Input')),
        getUser: jest.fn().mockResolvedValueOnce({
            data: {
                user: {
                    securityQuestionStatus: 'ENABLED',
                    pinStatus: 'ENABLED'
                }
            }
        })
    },
    userDAO: {
        insertUser: jest.fn(() => Promise.resolve())
    }
}));
(0, logger_1.registerLogger)(new logger_1.SampleServerLogger());
const hashedPassword = (0, bcrypt_1.hashSync)('123', 10);
const user = {
    email: 'a@b.com',
    password: hashedPassword,
    userId: '1',
    createdAt: Date.now().toString()
};
describe('signUp', () => {
    test('Should return 200 on user created', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = (0, express_1.getMockReq)({
            body: { email: 'a@b.com', password: '123' }
        });
        const { res } = (0, express_1.getMockRes)();
        yield (0, onboarding_1.signUpCallback)(req, res)(null, []);
        expect(res.status).toHaveBeenCalledWith(200);
    }));
    test('Should return 201 on repeated signup', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = (0, express_1.getMockReq)({
            body: { email: 'a@b.com', password: '123' }
        });
        const { res } = (0, express_1.getMockRes)();
        yield (0, onboarding_1.signUpCallback)(req, res)(null, [user]);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith({});
    }));
    test('Should return 400 on error', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = (0, express_1.getMockReq)({
            body: { email: 'a@b.com', password: '123' }
        });
        const { res } = (0, express_1.getMockRes)();
        try {
            yield (0, onboarding_1.signUpCallback)(req, res)(new Error('Error occurred'), []);
        }
        catch (err) {
            expect(err.message).toBe('Error occurred');
        }
    }));
});
describe('signIn', () => {
    test('Should return 200 on successful authentication', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = (0, express_1.getMockReq)({
            body: { email: 'a@b.com', password: '123' }
        });
        const { res } = (0, express_1.getMockRes)();
        yield (0, onboarding_1.signInCallback)(req, res)(null, [user]);
        expect(res.status).toHaveBeenCalledWith(200);
    }));
    test('Should return 404 on user not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = (0, express_1.getMockReq)({
            body: { email: 'a@b.com', password: '123' }
        });
        const { res } = (0, express_1.getMockRes)();
        yield (0, onboarding_1.signInCallback)(req, res)(null, []);
        expect(res.sendStatus).toHaveBeenCalledWith(404);
    }));
    test('Should return 400 on error', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = (0, express_1.getMockReq)({
            body: { email: 'a@b.com', password: '123' }
        });
        const { res } = (0, express_1.getMockRes)();
        try {
            yield (0, onboarding_1.signInCallback)(req, res)(new Error('Error occurred'), []);
        }
        catch (err) {
            expect(err.message).toBe('Error occurred');
        }
    }));
});
