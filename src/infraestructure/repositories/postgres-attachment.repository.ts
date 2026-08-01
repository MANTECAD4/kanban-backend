import {
  SubmitAttachmentDto,
  SubmitMulterFileDto,
} from "../../application/dtos/attatchment.dto";
import { AttachmentEntity } from "../../domain/entities/attachment.entity";
import { AttachmentRepository } from "../../domain/repositories/attachment.repository";

export class PostgresAttachmentRepository implements AttachmentRepository {
  public create = async (
    taskId: number,
    data: SubmitAttachmentDto,
  ): Promise<AttachmentEntity> => {
    throw "not implemented";
  };
  public delete = async (attatchmentId: number): Promise<AttachmentEntity> => {
    throw "not implemented";
  };
  public getAllByTask = async (taskId: number): Promise<AttachmentEntity[]> => {
    throw "not implemented";
  };
}
