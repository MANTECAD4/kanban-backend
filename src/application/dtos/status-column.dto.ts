import z from "zod";
import { ParamsWithIdSchema } from "../../presentation/shared/schemas/int-id.schema";

export const GetTasksSchema = ParamsWithIdSchema("boardId");
export interface GetTasksDto {
  boardId: number;
}

export const CreateStatusColumnSchema = z.strictObject({
  name: z.string().trim().normalize().nonempty(),
});

export const UpdateStatusColumnSchema = CreateStatusColumnSchema.partial();

export type CreateStatusColumnDto = z.infer<typeof CreateStatusColumnSchema>;
export type UpdateStatusColumnDto = z.infer<typeof UpdateStatusColumnSchema>;
