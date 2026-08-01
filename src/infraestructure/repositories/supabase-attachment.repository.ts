import { supabase } from "../../data/init-supabase-storage";
import { CloudAttachmentEntity } from "../../domain/entities/cloud-attachment.entity";
import { CloudAttachmentRepository } from "../../domain/repositories/cloud-attachment.repository";

export class SupabaseAttachmentRepository implements CloudAttachmentRepository {
  public upload = async (
    storePath: string,
    file: Buffer,
    mimeType: string,
  ): Promise<CloudAttachmentEntity> => {
    const { data, error } = await supabase.storage
      .from("kanban-app")
      .upload(storePath, file, {
        contentType: mimeType,
      });
    if (error) {
      throw error;
    } else {
      const sourceUrl = supabase.storage
        .from("kanban-app")
        .getPublicUrl(data.path);
      return CloudAttachmentEntity.fromObject({ ...data, sourceUrl });
    }
  };
}
