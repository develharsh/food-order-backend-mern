"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
try {
    if (!process.env.NODE_ENV) {
        throw new Error("NODE_ENV is undefined");
    }
    if (!process.env.NODE_JWT_SECRET) {
        throw new Error("JWT_SECRET is undefined");
    }
    if (!process.env.NODE_HOST_DEVELOPMENT) {
        throw new Error("NODE_HOST_DEVELOPMENT is undefined");
    }
    if (!process.env.NODE_USER_DEVELOPMENT) {
        throw new Error("NODE_USER_DEVELOPMENT is undefined");
    }
    if (!process.env.NODE_DB_PORT_DEVELOPMENT) {
        throw new Error("NODE_DB_PORT_DEVELOPMENT is undefined");
    }
    if (!process.env.NODE_PASSWORD_DEVELOPMENT) {
        throw new Error("NODE_PASSWORD_DEVELOPMENT is undefined");
    }
    if (!process.env.NODE_DATABASE_DEVELOPMENT) {
        throw new Error("NODE_DATABASE_DEVELOPMENT is undefined");
    }
}
catch (error) {
    console.log(error.message);
    process.exit(0);
}
const props = {
    host: process.env[`NODE_HOST_${process.env.NODE_ENV.toUpperCase()}`],
    user: process.env[`NODE_USER_${process.env.NODE_ENV.toUpperCase()}`],
    port: Number(process.env[`NODE_DB_PORT_${process.env.NODE_ENV.toUpperCase()}`]),
    password: process.env[`NODE_PASSWORD_${process.env.NODE_ENV.toUpperCase()}`],
    database: process.env[`NODE_DATABASE_${process.env.NODE_ENV.toUpperCase()}`],
};
const pool = new pg_1.default.Pool(props);
console.log(`Connected to DB: ${props.host} with mode: ${process.env.NODE_ENV}`);
exports.default = pool;
