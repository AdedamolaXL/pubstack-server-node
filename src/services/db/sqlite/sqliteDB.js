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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupDB = exports.initDB = exports.createUserTable = void 0;
const sqlite3_1 = require("sqlite3");
const dao_1 = require("../dao");
const sqliteUserDAO_1 = require("./sqliteUserDAO");
const logger_1 = require("../../logging/logger");
const client = new sqlite3_1.Database((_a = process.env.DATABASE_FILENAME) !== null && _a !== void 0 ? _a : ':memory:');
const userDAO = new sqliteUserDAO_1.SqliteUserDAO(client);
const createUserTable = (db) => {
    db.serialize(() => {
        db.exec('CREATE TABLE IF NOT EXISTS users (userId TEXT PRIMARY KEY, email TEXT UNIQUE, password TEXT, createdAt TEXT DEFAULT CURRENT_TIMESTAMP)');
    });
};
exports.createUserTable = createUserTable;
const initDB = () => {
    (0, dao_1.registerUserDAO)(userDAO);
    (0, exports.createUserTable)(client);
    logger_1.logger.info('Created users table');
};
exports.initDB = initDB;
const cleanupDB = () => {
    client.close((err) => {
        if (err) {
            return logger_1.logger.error(err.message);
        }
        logger_1.logger.info('Database connection closed successfully');
    });
};
exports.cleanupDB = cleanupDB;
