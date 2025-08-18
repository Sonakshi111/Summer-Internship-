import { Request, Response } from "express";
import { addBatchAllotmentToSheet } from "../Models/sheetsModel.js";

export const submitBatchAllotment = async (req: Request, res: Response) => {
  try {
    await addBatchAllotmentToSheet(req.body);
    res.json({ success: true, message: "Batch allotment stored successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
