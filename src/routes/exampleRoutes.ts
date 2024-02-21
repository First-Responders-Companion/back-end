import { Router } from "express";
import { getExample, postExampleData } from "../controllers/exampleControllers";

const router = Router();

router.get("/", getExample);
router.post("/", postExampleData);

export default router;
