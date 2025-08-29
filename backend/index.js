import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import { app } from "./src/app.js";

dotenv.config({
    path: "./.env"
})

connectDB()
.then(() => {
    app.on("error", (error) => {
        console.log("ERRR: ", error);
        throw error;
    });

    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at ${process.env.PORT}\nhttp://localhost:${process.env.PORT}/`);
    });
})
.catch((error) => {
    console.log("MONGO db connection failed !!! ", error);
})