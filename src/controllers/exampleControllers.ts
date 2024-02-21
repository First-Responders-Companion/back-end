import { RequestHandler } from "express";

export const getExample: RequestHandler = (req, res, next) => {
    res.json({ message: "Hello World" });
};