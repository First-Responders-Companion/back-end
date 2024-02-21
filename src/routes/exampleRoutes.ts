import { Router } from "express";
import { getExample } from "../controllers/exampleControllers";

const router = Router();

router.get("/1", getExample);

export default router;
