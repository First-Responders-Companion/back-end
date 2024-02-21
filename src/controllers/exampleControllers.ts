import { RequestHandler } from "express";

export const getExample: RequestHandler = (req, res, next) => {
  res.json({ message: "Hello World" });
};

export const getExampleData: RequestHandler = (req, res, next) => {
  const { name, id }: IExampleData = req.body;

  res.json({ name, id });
};
