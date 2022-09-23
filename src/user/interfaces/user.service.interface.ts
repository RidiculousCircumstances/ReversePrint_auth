import { HTTPError } from '../../errors/HTTP.error';
import { ClientCreateDto, ClientUpdateDto } from '../client/dto/client-create.dto';
import { ClientLoginDto } from '../client/dto/client-login.dto';
import { ClientViewDto } from '../client/dto/clientView.dto';
import { Client } from '../client/entities/client.entity';
import { IJWTTokens } from './user.tokenService.interface';

export interface IUserService {
  create: (
    dto: ClientCreateDto,
    fingerprint: Express.IFingerprintObject,
  ) => Promise<ClientViewDto | HTTPError>;
  validate: (dto: ClientLoginDto) => Promise<Client | HTTPError>;
  update: (id: string, dto: ClientUpdateDto) => Promise<ClientViewDto | HTTPError>;
  activate: (link: string) => Promise<HTTPError | void>;
  login: (
    client: Client,
    fingerprint: Express.IFingerprintObject,
  ) => Promise<ClientViewDto | HTTPError>;
  logout: (token: string) => Promise<void>;
  refresh: (token: string) => Promise<IJWTTokens | HTTPError>;
}
