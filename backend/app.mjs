import express from "express";
import path from "path";
import middleware from "./middleware/index.mjs";
import errorHandler from "./middleware/errorHandler.mjs";

import routes from "./src/v1/routes/index.mjs";

const app = express();

// connectDB();
middleware(app);
app.use("/api/v1/", routes);
errorHandler(app);

export default app;
