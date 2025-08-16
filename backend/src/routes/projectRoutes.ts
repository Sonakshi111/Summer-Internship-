// import { Router } from "express";
// import { getProjects, addProject } from "../controllers/projectController";

// const router = Router();

// router.get("/", getProjects);
// router.post("/", addProject);

// export default router;
import express from "express";
import { addProjects, getProjects, batchAllotment } from "../controllers/projectController";

const router = express.Router();

// Admin: Add multiple projects
router.post("/projects", addProjects);

// Student: Fetch filtered projects
router.get("/projects", getProjects);

// Student: Submit batch allotment
router.post("/batch-allotment", batchAllotment);

export default router;
