import express from "express";
import cors from "cors";
import { tagsRouter } from "./tags";
import { assetsRouter } from "./assets";

const app = express();
app.use((_req, _res, next) => {
    if (process.env.NODE_ENV === "development") {
        return cors()
    }
    return next()
});
app.use(express.json());

app.use((req, _res, next) => {
    if (process.env.NODE_ENV === "development") {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    }
    next();
})

app.use("/tags", tagsRouter);

app.use("/assets", assetsRouter);

if (process.env.NODE_ENV !== "test") {
    const PORT = 4000;
    app.listen(PORT, () => {
        console.log(`API http://localhost:${PORT}`);
    });
}
export default app