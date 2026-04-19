// export interface findAllDto{
//     userId:number;
// }

export interface CreateBoardDto {
  name: string;
  description: string;
  userId: number;
}

export type UpdateBoardDto = Partial<Omit<CreateBoardDto, "userId">>;
