import z, { ZodObject } from "zod";

/**
 * Returns a zod object that validates an object with an id-like property
 * @param idPropertyName specific name for the id variante p.e -> 'userId' | 'boardId' | 'id' etc...
 * @returns
 */
export const ParamsWithIdSchema = (idPropertyName: string = "id") =>
  z.object({
    [idPropertyName]: z.coerce.number().int().min(1),
  });
