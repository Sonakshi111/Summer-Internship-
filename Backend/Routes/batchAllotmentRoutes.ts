import { Router } from "express";
import { submitBatchAllotment } from "../Controllers/batchAllotmentController";

const router = Router();

router.post("/", submitBatchAllotment);

export default router;
