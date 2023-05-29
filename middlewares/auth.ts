import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { IExtendedRequest } from "../types";
import pool from "../database";

export const isAuthenticated: any = async (
  req: IExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined = req.headers.authorization;
    if (!token) throw new Error("User is not logged in");
    token = token.replace("Bearer ", "");
    if (!process.env.JWT_SECRET) {
      throw new Error("Env JWT Secret not loaded");
    }
    const payload: any = jwt.verify(token, process.env.JWT_SECRET);
    const userData = await pool.query(
      `select * from users where id='${payload._id}' limit 1;`
    );
    if (userData.rowCount == 0)
      throw new Error("Session Expired, Please Login Again");
    else {
      req.userInfo = userData.rows.at(0);
      next();
    }
  } catch (err: any) {
    res.status(401).json({ success: false, message: err.message });
  }
};
