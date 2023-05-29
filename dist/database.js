"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.NODE_ENV)
    process.env.NODE_ENV = "development";
const props = {
    host: process.env[`NODE_APP_HOST_${process.env.NODE_ENV.toUpperCase()}`],
    user: process.env[`NODE_APP_USER_${process.env.NODE_ENV.toUpperCase()}`],
    port: Number(process.env[`NODE_APP_DB_PORT_${process.env.NODE_ENV.toUpperCase()}`]),
    password: process.env[`NODE_APP_PASSWORD_${process.env.NODE_ENV.toUpperCase()}`],
    database: process.env[`NODE_APP_DATABASE_${process.env.NODE_ENV.toUpperCase()}`],
};
const pool = new pg_1.default.Pool(props);
console.log(`Connected to DB: ${props.host} with mode: ${process.env.NODE_ENV}`);
exports.default = pool;
