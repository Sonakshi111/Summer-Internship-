import { Router } from "express";
import { submitBatchAllotment } from "../controllers/batchAllotmentController";

const router = Router();

router.post("/", submitBatchAllotment);

export default router;
