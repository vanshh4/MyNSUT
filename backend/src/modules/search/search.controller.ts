import type { Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse.js";
import { performStudentSearch } from "./search.service.js";
import { searchSchema } from "./search.validation.js";

export async function searchStudents(request: Request, response: Response): Promise<void> {
  const query = searchSchema.parse(request.query);
  const results = await performStudentSearch(query.q);
  response.status(200).json(apiResponse(results, "Search completed successfully."));
}
