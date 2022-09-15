import { Inject, Injectable } from 'inversion-tools';
import { TYPES } from '../types';
import { ClientCreateDto } from './client/dto/client-create.dto';
import { ClientLoginDto } from './client/dto/client-login.dto';
import { IUserService } from './interfaces/user.service.interface';
import { UserRepository } from './user.repository';
import { Client } from './client/entities/client.entity';
import { ClientUpdateDto } from './client/dto/client-update.dto';

@Injectable()
export class UserService implements IUserService {
  constructor(@Inject(TYPES.UserRepository) private readonly userRepository: UserRepository) {}

  async createClient(dto: ClientCreateDto): Promise<Client | null> {
    const candidate = await this.userRepository.findClientByEmail(dto.email);

    if (!candidate) {
      const result = await this.userRepository.saveClient(dto);
      return result;
    }
    return null;
  }

  async updateClientInfo(email: string, dto: ClientUpdateDto): Promise<Client | null> {
    const candidate = await this.userRepository.findClientByEmail(email);
    if (!candidate) {
      return null;
    }

    const updatedClient = this.userRepository.updateClientInfo(candidate, dto);

    return updatedClient;
  }

  //async createEmployee(dto: EmployeeCreateDto): Promise<void> {}

  async validateUser(dto: ClientLoginDto): Promise<boolean> {
    const client = await this.userRepository.findClientByEmail(dto.login);
    if (!client) {
      return false;
    } else {
      const isMatchedPassword = client.comparePassword(dto.password);
      return isMatchedPassword;
    }
  }
}
