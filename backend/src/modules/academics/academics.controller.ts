import type { Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.js";
import { getStudentAcademicSummary, getStudentSemesterResult } from "./academics.service.js";

export async function getAcademicSummary(request: Request, response: Response): Promise<void> {
  const { rollNumber } = request.params;
  const summary = await getStudentAcademicSummary(request.auth!.userId, rollNumber);
  response.status(200).json(apiResponse(summary, "Academic summary retrieved successfully."));
}

export async function getSemesterResult(request: Request, response: Response): Promise<void> {
  const { rollNumber, semester } = request.params;
  const result = await getStudentSemesterResult(request.auth!.userId, rollNumber, Number(semester));
  response.status(200).json(apiResponse(result, "Semester result retrieved successfully."));
}
