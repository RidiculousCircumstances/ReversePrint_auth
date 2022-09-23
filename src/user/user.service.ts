import { Inject, Injectable } from 'inversion-tools';
import { TYPES } from '../types';
import { ClientCreateDto, ClientUpdateDto } from './client/dto/client-create.dto';
import { ClientLoginDto } from './client/dto/client-login.dto';
import { IUserService } from './interfaces/user.service.interface';
import { UserRepository } from './user.repository';
import { Client } from './client/entities/client.entity';
import { v4 } from 'uuid';
import { IMailService } from './interfaces/user.mailservice.interface';
import { IJWTTokens, ITokenService } from './interfaces/user.tokenService.interface';
import { IConfigService } from '../config/interfaces/config.service.interface';
import { HTTPError } from '../errors/HTTP.error';
import { Connection } from './client/entities/connection.entity';
import {
  ALREADY_AUTHORIZED_ERROR,
  ALREDY_EXISTS_ERROR,
  NON_EXISTEN_USER_ERROR,
  UNAUTHORIZED_ERROR,
  WRONG_LOGIN_OR_PASS_ERROR,
} from './user.constants';
import { ClientViewDto } from './client/dto/clientView.dto';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(TYPES.UserRepository) private readonly userRepository: UserRepository,
    @Inject(TYPES.MailService) private readonly mailService: IMailService,
    @Inject(TYPES.TokenService) private readonly tokenService: ITokenService,
    @Inject(TYPES.ConfigService) private readonly configService: IConfigService,
  ) {}

  async create(
    dto: ClientCreateDto,
    fingerprint: Express.IFingerprintObject,
  ): Promise<ClientViewDto | HTTPError> {
    const candidate = await Client.findOneBy({ email: dto.email });

    if (candidate) {
      return new HTTPError(400, ALREDY_EXISTS_ERROR);
    }

    const link = v4();
    const activationLink = `${this.configService.get('API_URL')}/users/activate/${link}`;
    const savedClient = await this.userRepository.saveClient(dto, link);
    await this.mailService.sendActivationLink(dto.email, activationLink);
    const tokens = this.tokenService.generate(savedClient);
    await this.tokenService.save(savedClient, tokens.refreshToken, fingerprint);

    const clientView = await this.userRepository.getClientView(savedClient.id);

    if (!clientView.personView) {
      return new HTTPError(500, ALREDY_EXISTS_ERROR);
    }
    const result = new ClientViewDto(clientView.addressView, clientView.personView, tokens);

    return result;
  }

  async activate(activationLink: string): Promise<HTTPError | void> {
    const client = await Client.findOneBy({ activationLink });
    if (!client) {
      return new HTTPError(400, NON_EXISTEN_USER_ERROR);
    }
    const connections = await Connection.findBy({ clientId: client.id });
    this.userRepository.saveActivationStatus(client);

    for (const connection of connections) {
      await this.logout(connection.refreshToken);
    }
  }

  async update(id: string, dto: ClientUpdateDto): Promise<ClientViewDto | HTTPError> {
    const candidate = await Client.findOneBy({ id });
    if (!candidate) {
      return new HTTPError(404, NON_EXISTEN_USER_ERROR);
    }

    if (dto.personInfo) {
      const checkedMail = await Client.findOneBy({ email: dto.personInfo.email });
      if (checkedMail) {
        return new HTTPError(422, ALREDY_EXISTS_ERROR);
      }
    }
    const updatedClient = await this.userRepository.updateClient(candidate, dto);

    const clientView = await this.userRepository.getClientView(updatedClient.id);
    if (!clientView.personView) {
      return new HTTPError(500, ALREDY_EXISTS_ERROR);
    }
    const result = new ClientViewDto(clientView.addressView, clientView.personView);

    return result;
  }

  async validate(dto: ClientLoginDto): Promise<Client | HTTPError> {
    const client = await Client.findOneBy({ email: dto.email });
    if (!client) {
      return new HTTPError(400, WRONG_LOGIN_OR_PASS_ERROR);
    } else {
      const isMatchedPassword = await client.comparePassword(dto.password);
      if (isMatchedPassword) {
        return client;
      } else {
        return new HTTPError(400, WRONG_LOGIN_OR_PASS_ERROR);
      }
    }
  }

  async login(
    client: Client,
    fingerprint: Express.IFingerprintObject,
  ): Promise<ClientViewDto | HTTPError> {
    const connection = await Connection.findOneBy({
      fingerprint: fingerprint.fingerprint,
      clientId: client.id,
      ip: fingerprint.ip,
    });

    if (connection) {
      return new HTTPError(400, ALREADY_AUTHORIZED_ERROR);
    }
    const tokens = this.tokenService.generate(client);
    await this.tokenService.save(client, tokens.refreshToken, fingerprint);
    const clientView = await this.userRepository.getClientView(client.id);
    if (!clientView.personView) {
      return new HTTPError(500, ALREDY_EXISTS_ERROR);
    }
    const result = new ClientViewDto(clientView.addressView, clientView.personView, tokens);
    return result;
  }

  async logout(token: string): Promise<void> {
    await this.tokenService.remove(token);
  }

  async refresh(token: string): Promise<IJWTTokens | HTTPError> {
    if (!token) {
      return new HTTPError(401, UNAUTHORIZED_ERROR);
    }
    const validToken = this.tokenService.validate(token, 'refresh');
    const connection = await Connection.findOneBy({ refreshToken: token });
    if (!validToken || !connection) {
      return new HTTPError(401, UNAUTHORIZED_ERROR);
    }
    const client = await Client.findOneBy({
      connections: { refreshToken: connection.refreshToken },
    });
    if (!client) {
      return new HTTPError(401, UNAUTHORIZED_ERROR);
    }
    const tokens = this.tokenService.generate(client);
    await this.tokenService.update(connection, tokens.refreshToken);
    return { ...tokens };
  }
}
