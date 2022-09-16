import { ClientCreateDto, ClientUpdateDto } from '../client/dto/client-create.dto';
import { ClientLoginDto } from '../client/dto/client-login.dto';
import { Client } from '../client/entities/client.entity';
import { User } from '../common/user.entity';

export interface IUserService {
  createClient: (dto: ClientCreateDto) => Promise<Client | null>;
  validateUser: (dto: ClientLoginDto) => Promise<boolean>;
  updateClientInfo: (email: string, dto: ClientUpdateDto) => Promise<Client | null>;
}
