// import { sheets } from "../config/googleClient";

// const sheetId = process.env.SHEET_ID!;

// // Fetch projects filtered by duration & branch
// export const getProjectsFromSheet = async (duration: string, branch: string) => {
//   const response = await sheets.spreadsheets.values.get({
//     spreadsheetId: sheetId,
//     range: "Sheet1",
//   });

//   const rows = response.data.values || [];
//   const dataRows = rows.slice(1);

//   return dataRows
//     .map((row) => ({
//       projectName: row[0],
//       projectCode: row[1],
//       duration: row[2],
//       branch: row[3],
//       batch: row[4],
//       timeSlots: [row[5], row[6], row[7], row[8]].filter(Boolean),
//     }))
//     .filter(
//       (project) =>
//         project.duration.toLowerCase().replace(/\s/g, "") ===
//           duration.toLowerCase().replace(/\s/g, "") &&
//         project.branch.toLowerCase() === branch.toLowerCase()
//     );
// };

// // Add a new project
// export const addProjectToSheet = async (project: any) => {
//   await sheets.spreadsheets.values.append({
//     spreadsheetId: sheetId,
//     range: "Sheet1",
//     valueInputOption: "RAW",
//     requestBody: {
//       values: [
//         [
//           project.name,
//           project.code,
//           project.duration,
//           project.branch,
//           project.batch,
//           ...project.slots,
//         ],
//       ],
//     },
//   });
// };

// // Add a batch allotment entry
// export const addBatchAllotmentToSheet = async (data: any) => {
//   await sheets.spreadsheets.values.append({
//     spreadsheetId: sheetId,
//     range: "Sheet2",
//     valueInputOption: "RAW",
//     requestBody: {
//       values: [
//         [
//           data.uid,
//           data.receiptNo,
//           data.name,
//           data.fatherName,
//           data.college,
//           data.mobile,
//           data.address,
//           data.course,
//           data.year,
//           data.branch,
//           data.duration,
//           data.trade,
//           data.slot,
//           data.project,
//           new Date().toISOString(),
//         ],
//       ],
//     },
//   });
// };



import { sheets } from "../config/googleClient";

const sheetId = process.env.SHEET_ID!;

interface ProjectRow {
  projectName: string;
  projectCode: string;
  duration: string;
  branch: string;
  batch: string;
  timeSlots: string[];
}

interface BatchAllotmentData {
  uid: string;
  receiptNo: string;
  name: string;
  fatherName: string;
  college: string;
  mobile: string;
  address: string;
  course: string;
  year: string;
  branch: string;
  duration: string;
  trade: string;
  slot: string;
  project: string;
}

export const getProjectsFromSheet = async (
  duration: string,
  branch: string
): Promise<ProjectRow[]> => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "Sheet1",
  });

  const rows = response.data.values || [];
  const dataRows = rows.slice(1);

  return dataRows
    .map((row) => ({
      projectName: row[0],
      projectCode: row[1],
      duration: row[2],
      branch: row[3],
      batch: row[4],
      timeSlots: [row[5], row[6], row[7], row[8]].filter(Boolean),
    }))
    .filter(
      (project) =>
        project.duration.toLowerCase().replace(/\s/g, "") ===
          duration.toLowerCase().replace(/\s/g, "") &&
        project.branch.toLowerCase() === branch.toLowerCase()
    );
};

// export const addProjectToSheet = async (project: any) => {
//   await sheets.spreadsheets.values.append({
//     spreadsheetId: sheetId,
//     range: "Sheet1",
//     valueInputOption: "RAW",
//     requestBody: {
//       values: [
//         [
//           project.name,
//           project.code,
//           project.duration,
//           project.branch,
//           project.batch,
//           ...project.slots,
//         ],
//       ],
//     },
//   });
// };
export const addProjectToSheet = async (project: any) => {
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "Sheet1",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          project.projectName,   // ✅ use projectName
          project.projectCode,   // ✅ use projectCode
          project.duration,
          project.branch,
          project.batch,
          ...(project.timeSlots || []), // ✅ use timeSlots
        ],
      ],
    },
  });
};


export const addBatchAllotmentToSheet = async (data: BatchAllotmentData) => {
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "Sheet2",
    valueInputOption: "RAW",
    requestBody: {
      values: [
        [
          data.uid,
          data.receiptNo,
          data.name,
          data.fatherName,
          data.college,
          data.mobile,
          data.address,
          data.course,
          data.year,
          data.branch,
          data.duration,
          data.trade,
          data.slot,
          data.project,
          new Date().toISOString(),
        ],
      ],
    },
  });
};

