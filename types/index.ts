import { Request } from "express";

export interface IUserSchema {
  id: string;
  email: string;
  password: string;
  name: string;
}

export interface IExtendedRequest extends Request {
  userInfo: null | IUserSchema;
}
