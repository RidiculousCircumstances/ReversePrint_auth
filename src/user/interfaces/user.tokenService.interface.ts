import { JwtPayload } from 'jsonwebtoken';
import { Client } from '../client/entities/client.entity';
import { Connection } from '../client/entities/connection.entity';

export interface IPayload {
  userId: string;
  email: string;
  isActivated: boolean;
}

export interface IJWTTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ITokenService {
  generate: (client: Client) => IJWTTokens;
  save: (client: Client, token: string, fingerprint: Express.IFingerprintObject) => Promise<void>;
  update: (connection: Connection, token: string) => Promise<void>;
  remove: (token: string) => Promise<void>;
  validate: (token: string, type: 'access' | 'refresh') => string | JwtPayload | null;
}
