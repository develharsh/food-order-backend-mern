import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
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
    const payload: any = verify(token, process.env.NODE_JWT_SECRET ?? "dummy");
    const userData = await pool.query(
      `select * from users where user_id=$1 limit 1;`,
      [payload._id]
    );
    if (userData.rowCount == 0)
      throw new Error("Session Expired, Please Login Again");
    else {
      req.userInfo = userData.rows.at(0);
      next();
    }
  } catch (err: any) {
    if (["invalid token", "jwt expired"].includes(err.message))
      err.message = `Session Expired, Please Login Again`;
    res.status(401).json({ success: false, message: err.message });
  }
};
