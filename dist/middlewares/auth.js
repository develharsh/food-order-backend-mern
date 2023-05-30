"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const database_1 = __importDefault(require("../database"));
const isAuthenticated = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token)
            throw new Error("User is not logged in");
        token = token.replace("Bearer ", "");
        const payload = (0, jsonwebtoken_1.verify)(token, process.env.NODE_JWT_SECRET ?? "dummy");
        const userData = await database_1.default.query(`select * from users where user_id=$1 limit 1;`, [payload._id]);
        if (userData.rowCount == 0)
            throw new Error("Session Expired, Please Login Again");
        else {
            req.userInfo = userData.rows.at(0);
            next();
        }
    }
    catch (err) {
        if (["invalid token", "jwt expired"].includes(err.message))
            err.message = `Session Expired, Please Login Again`;
        res.status(401).json({ success: false, message: err.message });
    }
};
exports.isAuthenticated = isAuthenticated;
