import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.NODE_ENV) process.env.NODE_ENV = "development";

const props = {
  host: process.env[`NODE_APP_HOST_${process.env.NODE_ENV.toUpperCase()}`],
  user: process.env[`NODE_APP_USER_${process.env.NODE_ENV.toUpperCase()}`],
  port: Number(
    process.env[`NODE_APP_DB_PORT_${process.env.NODE_ENV.toUpperCase()}`]
  ),
  password:
    process.env[`NODE_APP_PASSWORD_${process.env.NODE_ENV.toUpperCase()}`],
  database:
    process.env[`NODE_APP_DATABASE_${process.env.NODE_ENV.toUpperCase()}`],
};

const pool = new pg.Pool(props);
console.log(
  `Connected to DB: ${props.host} with mode: ${process.env.NODE_ENV}`
);
export default pool;
