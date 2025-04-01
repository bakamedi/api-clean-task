import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IHash } from './interfaces/IHash';

@Injectable()
export class BcryptRepository implements IHash {
  private rounds: number = 10;

  hash(password: string): string {
    return bcrypt.hashSync(password, this.rounds);
  }

  compare(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
