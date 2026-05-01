import { HasherService } from "../../domain/services/hasher.service";
import { createHash } from "crypto";

export class CryptoHasher implements HasherService {
  public hash = async (inputText: string): Promise<string> => {
    return createHash("sha256").update(inputText).digest("hex");
  };
  public compare = async (
    inputText: string,
    hashed: string,
  ): Promise<boolean> => {
    return hashed === createHash("sha256").update(inputText).digest("hex");
  };
}
