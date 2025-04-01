export interface IHash {
  hash(password: string): string;
  compare(password: string, hash: string): boolean;
}
