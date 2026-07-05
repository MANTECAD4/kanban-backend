import z from "zod";

/**
 * Returns a zod object that validates an object containing an id-like property
 * @param idPropertyName specifies the name for the id variant p.e -> 'userId' | 'boardId' | 'id' etc...
 * @returns
 */
export const ParamsWithIdSchema = (idPropertyName: string = "id") =>
  z.object({
    [idPropertyName]: z.coerce.number().int().min(1),
  });
export const ParamsWithSlugSchema = (slugPropertyName: string = "slug") =>
  z.object({
    [slugPropertyName]: z.string().trim().lowercase(),
  });
