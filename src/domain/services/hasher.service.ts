export abstract class HasherService {
  abstract hash: (inputText: string) => Promise<string>;
  abstract compare: (inputText: string, hashed: string) => Promise<boolean>;
}
