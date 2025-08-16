// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import projectRoutes from "./routes/projectRoutes";
// import batchAllotmentRoutes from "./routes/batchAllotmentRoutes";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/projects", projectRoutes);
// app.use("/api/batch-allotment", batchAllotmentRoutes);

// app.get("/", (req, res) => {
//   res.send("Backend running on port " + process.env.PORT);
// });

// app.listen(process.env.PORT || 8080, () => {
//   console.log(`✅ Server is running on port ${process.env.PORT || 8080}`);
// });
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import projectRoutes from "./routes/projectRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", projectRoutes);

app.get("/", (req, res) => {
  res.send("✅ Backend running on port " + process.env.PORT);
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`✅ Server is running on port ${process.env.PORT || 8080}`);
});
