"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true, limit: "5mb" }));
app.use((0, morgan_1.default)("dev"));
app.use("/v1", routes_1.default);
app.use("/test", (_, res) => {
    res.status(200).json({ success: true, message: "Backend is working fine." });
});
app.use(function (_, res) {
    res
        .status(500)
        .json({ success: false, message: "No such matching route was found" });
});
const port = process.env.PORT || 3001;
app.listen(port, function () {
    console.log("Express app running on port " + port);
});
/*const io = new Server(server, {
  cors: {
    origin: `http://localhost:3000`,
  },
});*/
// io.listen(3002);
