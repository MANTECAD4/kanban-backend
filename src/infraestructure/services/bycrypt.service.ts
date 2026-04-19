import { HasherService } from "../../domain/services/hasher.service";

import { hashSync, compareSync } from "bcryptjs";
export class BycryptHasher implements HasherService {
  public hash = (inputText: string) => {
    return hashSync(inputText, 10);
  };
  public compare = (inputText: string, hashed: string) => {
    return compareSync(inputText, hashed);
  };
}
