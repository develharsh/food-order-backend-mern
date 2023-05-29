"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.session = exports.login = exports.signup = void 0;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signup = async (req, res) => {
    let statusCode = 201;
    try {
        if (!process.env.JWT_SECRET) {
            statusCode = 500;
            throw new Error("Env JWT Secret not loaded");
        }
        let { email, password, name } = req.body;
        if (!email) {
            statusCode = 400;
            throw new Error("Invalid Email");
        }
        if (!password) {
            statusCode = 400;
            throw new Error("Invalid Password");
        }
        if (!name) {
            statusCode = 400;
            throw new Error("Invalid Name");
        }
        const exists = await database_1.default.query(`select * from users where email='${email}' limit 1;`);
        if (exists.rowCount) {
            statusCode = 500;
            throw new Error("Email already registered");
        }
        password = await bcrypt_1.default.hash(password, 12);
        const user = await database_1.default.query(`insert into users(email, password, name) values($1, $2, $3) returning id;`, [email, password, name]);
        const token = jsonwebtoken_1.default.sign({ _id: user.rows.at(0) }, process.env.JWT_SECRET, {
            expiresIn: "5d",
        });
        res
            .status(statusCode)
            .json({ success: true, message: `Successfully registered user`, token });
    }
    catch (error) {
        res.status(statusCode).json({ success: false, message: error.message });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    let statusCode = 200;
    try {
        if (!process.env.JWT_SECRET) {
            statusCode = 500;
            throw new Error("Env JWT Secret not loaded");
        }
        let { email, password } = req.body;
        if (!email) {
            statusCode = 400;
            throw new Error("Invalid Email");
        }
        if (!password) {
            statusCode = 400;
            throw new Error("Invalid Password");
        }
        const exists = await database_1.default.query(`select * from users where email='${email}' limit 1;`);
        if (exists.rowCount == 0) {
            statusCode = 500;
            throw new Error(`No such user exists`);
        }
        const isPasswordMatching = await bcrypt_1.default.compare(password, exists.rows.at(0).password);
        if (!isPasswordMatching) {
            statusCode = 400;
            throw new Error("No such user exists");
        }
        const token = jsonwebtoken_1.default.sign({ _id: exists.rows.at(0).id }, process.env.JWT_SECRET, {
            expiresIn: "5d",
        });
        res.status(statusCode).json({
            success: true,
            message: `Successfully logged in with user`,
            token,
        });
    }
    catch (error) {
        res.status(statusCode).json({ success: false, message: error.message });
    }
};
exports.login = login;
const session = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: `Successfully fetched User Info`,
            data: req.userInfo,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.session = session;
