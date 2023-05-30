import { Request, Response } from "express";
import pool from "../database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IExtendedRequest, EUserRoles } from "../types";

export const signup = async (req: Request, res: Response) => {
  let statusCode = 201;
  try {
    let user_email: string | undefined | null = req.body.user_email,
      user_password: string | undefined | null = req.body.user_password,
      user_name: string | undefined | null = req.body.user_name,
      user_role: EUserRoles | undefined | null = req.body.user_role;
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
    const exists = await pool.query(
      `select * from users where user_email=$1 limit 1;`,
      [user_email]
    );
    if (exists.rowCount) {
      statusCode = 500;
      throw new Error("Email already registered");
    }

    user_password = await bcrypt.hash(user_password, 12);
    let finalUserOpenForOrder = user_role == "delivery" ? false : null;
    const user = await pool.query(
      `insert into users(user_email, user_password, user_name, user_role, user_open_for_order) values($1, $2, $3, $4, $5) returning user_id;`,
      [user_email, user_password, user_name, user_role, finalUserOpenForOrder]
    );
    const token = jwt.sign(
      { _id: user.rows.at(0).user_id },
      process.env.NODE_JWT_SECRET ?? "dummy",
      {
        expiresIn: "5d",
      }
    );
    res
      .status(statusCode)
      .json({ success: true, message: `Successfully registered user`, token });
  } catch (error: any) {
    res.status(statusCode).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  let statusCode = 200;
  try {
    let user_email: string | undefined | null = req.body.user_email,
      user_password: string | undefined | null = req.body.user_password;
    if (!user_email) {
      statusCode = 400;
      throw new Error("Invalid Email");
    }
    if (!user_password) {
      statusCode = 400;
      throw new Error("Invalid Password");
    }

    const exists = await pool.query(
      `select * from users where user_email=$1 limit 1;`,
      [user_email]
    );
    if (exists.rowCount == 0) {
      statusCode = 500;
      throw new Error(`No such user exists`);
    }
    const isPasswordMatching: boolean = await bcrypt.compare(
      user_password,
      exists.rows.at(0).user_password
    );
    if (!isPasswordMatching) {
      statusCode = 400;
      throw new Error("No such user exists");
    }
    const token = jwt.sign(
      { _id: exists.rows.at(0).user_id },
      process.env.NODE_JWT_SECRET ?? "dummy",
      {
        expiresIn: "5d",
      }
    );
    res.status(statusCode).json({
      success: true,
      message: `Successfully logged in with user`,
      token,
    });
  } catch (error: any) {
    res.status(statusCode).json({ success: false, message: error.message });
  }
};

export const session: any = async (req: IExtendedRequest, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      message: `Successfully fetched User Info`,
      data: req.userInfo,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
