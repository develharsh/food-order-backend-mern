"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../database"));
const isAuthenticated = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token)
            throw new Error("User is not logged in");
        token = token.replace("Bearer ", "");
        if (!process.env.JWT_SECRET) {
            throw new Error("Env JWT Secret not loaded");
        }
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userData = await database_1.default.query(`select * from users where id='${payload._id}' limit 1;`);
        if (userData.rowCount == 0)
            throw new Error("Session Expired, Please Login Again");
        else {
            req.userInfo = userData.rows.at(0);
            next();
        }
    }
    catch (err) {
        res.status(401).json({ success: false, message: err.message });
    }
};
exports.isAuthenticated = isAuthenticated;
