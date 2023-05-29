import { Request, Response } from "express";
import pool from "../database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IExtendedRequest } from "../types";

export const signup = async (req: Request, res: Response) => {
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
    const exists = await pool.query(
      `select * from users where email='${email}' limit 1;`
    );
    if (exists.rowCount) {
      statusCode = 500;
      throw new Error("Email already registered");
    }

    password = await bcrypt.hash(password, 12);
    const user = await pool.query(
      `insert into users(email, password, name) values($1, $2, $3) returning id;`,
      [email, password, name]
    );
    const token = jwt.sign({ _id: user.rows.at(0) }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });
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

    const exists = await pool.query(
      `select * from users where email='${email}' limit 1;`
    );
    if (exists.rowCount == 0) {
      statusCode = 500;
      throw new Error(`No such user exists`);
    }
    const isPasswordMatching: boolean = await bcrypt.compare(
      password,
      exists.rows.at(0).password
    );
    if (!isPasswordMatching) {
      statusCode = 400;
      throw new Error("No such user exists");
    }
    const token = jwt.sign(
      { _id: exists.rows.at(0).id },
      process.env.JWT_SECRET,
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
