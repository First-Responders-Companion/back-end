import { RequestHandler } from "express";
import Example from "../models/Example";
import createHttpError from "http-errors";

export const getExample: RequestHandler = (req, res, next) => {
  res.json({ message: "Hello World" });
};

export const postExampleData: RequestHandler = async (req, res, next) => {
  const { name, id }: IExampleData = req.body;

  try {
    const example = await Example.findOne({ name });
    if (example) return next(createHttpError(406, "Name already exists"));

    const newExample = new Example({ name, id });
    await newExample.save();

    res.json({ name, id });
  } catch (error) {
    return next(createHttpError.InternalServerError);
  }
};
