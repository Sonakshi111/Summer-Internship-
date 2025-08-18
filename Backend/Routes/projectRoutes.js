import express from "express";
import { addProjects, getProjects, batchAllotment } from "../Controllers/projectController.js";

const router = express.Router();

// Admin: Add multiple projects
router.post("/projects", addProjects);

// Student: Fetch filtered projects
router.get("/projects", getProjects);

// Admin: Batch allotment
router.post("/batch-allotment", batchAllotment);

export default router;
