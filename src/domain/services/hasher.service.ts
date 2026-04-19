export abstract class HasherService {
  abstract hash: (inputText: string) => string;
  abstract compare: (inputText: string, hashed: string) => boolean;
}
