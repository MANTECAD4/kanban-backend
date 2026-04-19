export interface CreateTaskDto {
  title: string;
  description: string;
  order: number;
  statusId: number;
}

export type UpdateTaskDto = Partial<CreateTaskDto>;
