import { CustomError, ErrorCodes } from "../errors/custom-error";

export const getDefinedFields = (data: Record<string, any>) => {
  const definedFields: Record<string, any> = {};
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) return (definedFields[key] = value);
  });

  if (Object.keys(definedFields).length === 0)
    throw CustomError.badRequest(
      "No values were recieved for board updating.",
      ErrorCodes.BAD_REQUEST,
    );
  return definedFields;
};
