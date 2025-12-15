import express from "express";
import cors from "cors";
import { tagsRouter } from "./tags.js";
import { assetsRouter } from "./assets.js";

const app = express();
app.use((req, res, next) => {
    if (process.env.NODE_ENV === "development") {
        return cors()(req, res, next);
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
    const server = app.listen(PORT, () => {
        console.log(`API http://localhost:${PORT}`);
    });

    function shutdown(signal: string) {
        console.log(`received ${signal}`);
        server.close(() => {
            process.exit(0);
        });
    }
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
}
export default app