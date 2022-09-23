import { IJWTTokens, IPayload, ITokenService } from './interfaces/user.tokenService.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Inject, Injectable } from 'inversion-tools';
import { TYPES } from '../types';
import { IConfigService } from '../config/interfaces/config.service.interface';
import { UserRepository } from './user.repository';
import { Client } from './client/entities/client.entity';
import { Connection } from './client/entities/connection.entity';

@Injectable()
export class TokenService implements ITokenService {
  constructor(
    @Inject(TYPES.ConfigService) private readonly configService: IConfigService,
    @Inject(TYPES.UserRepository) private readonly userRepository: UserRepository,
  ) {}

  generate(client: Client): IJWTTokens {
    const payload = {
      userId: client.id,
      email: client.email,
      isActivated: client.isActivated,
    };
    const accessKey = this.configService.get('JWT_ACCESS_SECRET');
    const refreshKey = this.configService.get('JWT_REFRESH_SECRET');
    const accessToken = jwt.sign(payload, accessKey, { expiresIn: '15s' });
    const refreshToken = jwt.sign(payload, refreshKey, { expiresIn: '14d' });

    return {
      accessToken,
      refreshToken,
    };
  }

  async save(
    client: Client,
    token: string,
    fingerprint: Express.IFingerprintObject,
  ): Promise<void> {
    await this.userRepository.saveConnection(client, token, fingerprint);
  }

  async update(connection: Connection, token: string): Promise<void> {
    return await this.userRepository.updateConnection(connection, token);
  }

  async remove(token: string): Promise<void> {
    await this.userRepository.removeConnection(token);
  }

  validate(token: string, type: 'access' | 'refresh'): string | JwtPayload | null {
    try {
      if (type == 'access') {
        const clientData = jwt.verify(token, this.configService.get('JWT_ACCESS_SECRET'));
        return clientData;
      } else {
        const clientData = jwt.verify(token, this.configService.get('JWT_REFRESH_SECRET'));
        return clientData;
      }
    } catch (e) {
      return null;
    }
  }
}
