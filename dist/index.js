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
const app_1 = require("./app");
const sqliteDB_1 = require("./services/db/sqlite/sqliteDB");
const logger_1 = require("./services/logging/logger");
(0, logger_1.registerLogger)(new logger_1.SampleServerLogger());
(0, sqliteDB_1.initDB)();
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8080;
const server = app_1.app.listen(port, () => {
    logger_1.logger.info(`Server is running at http://localhost:${port}`);
});
process.on('SIGINT', function () {
    (0, sqliteDB_1.cleanupDB)();
    server.close();
    logger_1.logger.info('Server closed successfully');
});
