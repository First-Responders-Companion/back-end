import express, { ErrorRequestHandler } from "express";
import createHttpError from "http-errors";
import exampleRoute from "./routes/exampleRoutes";
import mongoose from "mongoose";
import { DB, PORT } from "./config";

const app = express();

app.use("/example", exampleRoute);

app.use(() => {
  throw createHttpError(404, "Not Found");
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err.message, err.statusCode);
  if (res.headersSent) {
    return next(err);
  }

  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Unknown Error" });
};

app.use(errorHandler);

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log(`Listening on PORT ${PORT}`);
    });
  })
  .catch(() => {
    throw createHttpError(501, "Unable to connect database");
  });
