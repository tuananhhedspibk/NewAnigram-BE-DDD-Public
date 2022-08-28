import { IAuthenticateRepository } from '@domain/repositories/authenticate';
import * as jwt from 'jsonwebtoken';

import { JWT_CONFIG } from '../../constants';

export class AuthenticateRepository implements IAuthenticateRepository {
  async getJWT(userId: number, userName: string): Promise<string> {
    return jwt.sign({ id: userId, name: userName }, JWT_CONFIG.secrete);
  }
}
