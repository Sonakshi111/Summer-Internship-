// import { Request, Response } from "express";
// import { getProjectsFromSheet, addProjectToSheet } from "../services/sheetsService";

// export const getProjects = async (req: Request, res: Response) => {
//   try {
//     const { duration, branch } = req.query;
//     if (!duration || !branch) {
//       return res.status(400).json({ success: false, message: "Missing duration or branch" });
//     }

//     const projects = await getProjectsFromSheet(String(duration), String(branch));
//     res.json({ success: true, projects });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const addProject = async (req: Request, res: Response) => {
//   try {
//     await addProjectToSheet(req.body);
//     res.json({ success: true, message: "Project added successfully" });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
import { Request, Response } from "express";
import { google } from "googleapis";
import { sheets } from "../config/googleClient"; // assuming you set this up already

const SHEET_ID = "1azyilF4UJX9H6txTx99cpM4lB1PKLO7kb-I2Uv6-G0A"; // your sheet ID
const PROJECTS_SHEET = "Sheet1";
const STUDENT_SHEET = "Sheet2";

// ✅ Add Projects (accepts multiple projects)
export const addProjects = async (req: Request, res: Response) => {
  try {
    const projects = Array.isArray(req.body) ? req.body : [req.body]; // handle single or multiple

    const values = projects.map((project: any) => [
      project.name,
      project.code,
      project.duration,
      project.branch,
      project.batch,
      ...(project.slots || []),
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: PROJECTS_SHEET,
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });

    res.json({ success: true, message: "Projects added successfully!" });
  } catch (error) {
    console.error("Error adding projects:", error);
    res.status(500).json({ success: false, message: "Error adding projects" });
  }
};

// ✅ Get Projects (filter by branch & duration)
export const getProjects = async (req: Request, res: Response) => {
  try {
    const { branch, duration } = req.query;

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: PROJECTS_SHEET,
    });

    const rows = result.data.values || [];
    const projects = rows.slice(1) // remove header row
      .map((row) => ({
        projectName: row[0],
        projectCode: row[1],
        duration: row[2],
        branch: row[3],
        batch: row[4],
        timeSlots: row.slice(5).filter((s) => s && s.trim() !== ""),
      }))
      .filter(
        (p) =>
          (!branch || p.branch === branch) &&
          (!duration || p.duration === duration)
      );

    res.json({ success: true, projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ success: false, message: "Error fetching projects" });
  }
};

// ✅ Student Batch Allotment
export const batchAllotment = async (req: Request, res: Response) => {
  try {
    const studentData = req.body;

    const values = [
      [
        studentData.uid,
        studentData.receiptNo,
        studentData.name,
        studentData.fatherName,
        studentData.college,
        studentData.mobile,
        studentData.address,
        studentData.course,
        studentData.year,
        studentData.branch,
        studentData.duration,
        studentData.trade,
        studentData.slot,
        studentData.project,
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: STUDENT_SHEET,
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });

    res.json({ success: true, message: "Batch allotment submitted successfully!" });
  } catch (error) {
    console.error("Error submitting batch allotment:", error);
    res.status(500).json({ success: false, message: "Error submitting batch allotment" });
  }
};
