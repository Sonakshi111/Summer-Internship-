import { sheets, sheetId } from "../Models/sheetsModel.js";

const PROJECTS_SHEET = "ProjectData";
const STUDENT_SHEET = "StudentDetails";

// ✅ Add Projects (accepts multiple projects)
export const addProjects = async (req, res) => {
  try {
    const projects = Array.isArray(req.body) ? req.body : [req.body];

    const values = projects.map((project) => [
      project.name,
      project.code,
      project.duration,
      project.branch,
      project.batch,
      ...(project.slots || []),
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
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
export const getProjects = async (req, res) => {
  try {
    const { branch, duration } = req.query;

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: PROJECTS_SHEET,
    });

    const rows = result.data.values || [];
    let projects = rows.slice(1) // remove header row
      .filter(row => row.length >= 9) // Ensure we have all required fields
      .map((row) => ({
        name: row[0] || '',
        code: row[1] || '',
        duration: row[2] || '',
        branch: row[3] || '',
        batch: row[4] || '',
        slot1: row[5] || '',
        slot2: row[6] || '',
        slot3: row[7] || '',
        slot4: row[8] || ''
      }));

    // Apply filters if provided
    if (branch) {
      projects = projects.filter(p => p.branch === branch);
    }
    if (duration) {
      projects = projects.filter(p => p.duration === duration);
    }

    res.json({ success: true, projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ success: false, message: "Error fetching projects" });
  }
};

export const batchAllotment = async (req, res) => {
  try {
    const {
      UID,
      receiptNo,
      name,
      fathersName,
      college,
      mobile,
      address,
      course,
      year,
      branch,
      duration,
      trade,
      slot,
      project,
      photoURL
    } = req.body;
    
    const values = [
      [
        UID || '',
        receiptNo || '',
        name || '',
        fathersName || '',
        college || '',
        mobile || '',
        address || '',
        course || '',
        year || '',
        branch || '',
        duration || '',
        trade || '',
        slot || '',
        project || '',
        photoURL || ''
      ]
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: STUDENT_SHEET,
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });

    res.json({ success: true, message: "Student details added successfully!" });
  } catch (error) {
    console.error("Error adding student details:", error);
    res.status(500).json({ success: false, message: "Error adding student details" });
  }
};
