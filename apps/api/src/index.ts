import express from "express";
import cors from "cors";
import { tagsRouter } from "./tags";
import { assetsRouter } from "./assets";

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
})

app.use("/tags", tagsRouter);

app.use("/assets", assetsRouter);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`API http://localhost:${PORT}`);
});