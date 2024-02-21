import express, { ErrorRequestHandler } from "express";
import createHttpError from "http-errors";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

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

app.listen(9000, () => {
  console.log("Server is running on port 9000");
});
