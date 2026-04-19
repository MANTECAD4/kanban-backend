export interface CreateStatusColumnDto {
  name: string;
  boardId: number;
}
export type UpdateStatusColumn = Partial<
  Omit<CreateStatusColumnDto, "boardId">
>;
