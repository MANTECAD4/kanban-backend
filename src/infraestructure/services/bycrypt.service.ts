import { HasherService } from "../../domain/services/hasher.service";

import { compare, hash } from "bcryptjs";
export class BycryptHasher implements HasherService {
  public hash = async (inputText: string) => {
    return hash(inputText, 10);
  };
  public compare = async (inputText: string, hashed: string) => {
    return compare(inputText, hashed);
  };
}
