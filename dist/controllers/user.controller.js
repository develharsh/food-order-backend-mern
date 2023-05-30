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
        let user_email = req.body.user_email, user_password = req.body.user_password, user_name = req.body.user_name, user_role = req.body.user_role;
        if (!user_email) {
            statusCode = 400;
            throw new Error("Invalid Email");
        }
        if (!user_password) {
            statusCode = 400;
            throw new Error("Invalid Password");
        }
        if (!user_name) {
            statusCode = 400;
            throw new Error("Invalid Name");
        }
        if (!user_role) {
            statusCode = 400;
            throw new Error("Invalid Name");
        }
        const exists = await database_1.default.query(`select * from users where user_email=$1 limit 1;`, [user_email]);
        if (exists.rowCount) {
            statusCode = 500;
            throw new Error("Email already registered");
        }
        user_password = await bcrypt_1.default.hash(user_password, 12);
        let finalUserOpenForOrder = user_role == "delivery" ? false : null;
        const user = await database_1.default.query(`insert into users(user_email, user_password, user_name, user_role, user_open_for_order) values($1, $2, $3, $4, $5) returning user_id;`, [user_email, user_password, user_name, user_role, finalUserOpenForOrder]);
        const token = jsonwebtoken_1.default.sign({ _id: user.rows.at(0).user_id }, process.env.NODE_JWT_SECRET ?? "dummy", {
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
        let user_email = req.body.user_email, user_password = req.body.user_password;
        if (!user_email) {
            statusCode = 400;
            throw new Error("Invalid Email");
        }
        if (!user_password) {
            statusCode = 400;
            throw new Error("Invalid Password");
        }
        const exists = await database_1.default.query(`select * from users where user_email=$1 limit 1;`, [user_email]);
        if (exists.rowCount == 0) {
            statusCode = 500;
            throw new Error(`No such user exists`);
        }
        const isPasswordMatching = await bcrypt_1.default.compare(user_password, exists.rows.at(0).user_password);
        if (!isPasswordMatching) {
            statusCode = 400;
            throw new Error("No such user exists");
        }
        const token = jsonwebtoken_1.default.sign({ _id: exists.rows.at(0).user_id }, process.env.NODE_JWT_SECRET ?? "dummy", {
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
