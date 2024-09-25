"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
var DataSource = require('typeorm').DataSource;
exports.AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'dev.sqlite',
    entities: ['dsrc/**/*.entity.ts'],
    migrations: ['src/migration/**/*.js'],
    synchronize: true
});
