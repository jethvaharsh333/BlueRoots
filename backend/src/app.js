import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(express.json({       // Parses incoming JSON requests and adds the data to req.body
    limit: "16kb"
}))

app.use(express.urlencoded({    // Parses incoming requests from traditional HTML forms
    extended: true,
    limit: "16kb",
}))

app.use(express.static("public"))   // Serves static files like images, CSS, JS or uploads from the public folder/

app.use(cookieParser())     // Allows reading and writing cookies on the server via req.cookies

import { transactionControl } from "./middlewares/transaction-control.middleware.js";

app.use(transactionControl);

import authRoutes from "./routes/auth.routes.js";
app.use("/api/v1/auth", authRoutes);

import { errorHandler } from "./middlewares/error-handler.middleware.js";
app.use(errorHandler);

export {app};