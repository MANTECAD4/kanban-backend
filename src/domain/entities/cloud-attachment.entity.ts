interface Props {
  path: string;
  id: string;
  fullPath: string;
  sourceUrl: string;
}

export class CloudAttachmentEntity {
  public readonly path: string;
  public readonly id: string;
  public readonly fullPath: string;
  public readonly sourceUrl: string;
  constructor(props: Props) {
    const { path, id, fullPath, sourceUrl } = props;
    this.path = path;
    this.id = id;
    this.fullPath = fullPath;
    this.sourceUrl = sourceUrl;
  }

  public static fromObject = (
    object: Record<string, any>,
  ): CloudAttachmentEntity => {
    const { path, id, full_path, fullPath, sourceUrl } = object;

    return new CloudAttachmentEntity({
      id,
      path,
      fullPath: fullPath ?? full_path,
      sourceUrl,
    });
  };
}
