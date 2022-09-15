import { Inject, Injectable } from 'inversion-tools';
import { DataSource } from 'typeorm';
import { MySQLService } from '../mySql/mySQL.service';
import { TYPES } from '../types';
import { ClientCreateDto } from './client/dto/client-create.dto';
import { ClientUpdateDto } from './client/dto/client-update.dto';
import { Building } from './client/entities/building.entity';
import { City } from './client/entities/city.entity';
import { Client } from './client/entities/client.entity';
import { Street } from './client/entities/street.entity';

@Injectable()
export class UserRepository {
  private dataSource: DataSource;

  constructor(@Inject(TYPES.MySQLService) private readonly mySQLService: MySQLService) {
    this.dataSource = mySQLService.dataSource;
  }

  private async saveOrGetAddress(dto: ClientCreateDto | ClientUpdateDto): Promise<Building> {
    let city = await City.findOne({ where: { name: dto.city } });

    if (!city) {
      city = City.create({ name: dto.city });
      await this.dataSource.manager.save(city);
    }

    let street = await Street.findOne({ where: { name: dto.street, cityId: { id: city.id } } });

    if (!street) {
      street = Street.create({ name: dto.street, cityId: city });
      await this.dataSource.manager.save(street);
    }

    let building = await Building.findOne({
      where: {
        number: dto.building,
        streetId: {
          id: street.id,
        },
      },
    });

    if (!building) {
      building = Building.create({ number: dto.building, streetId: street });
      await this.dataSource.manager.save(building);
    }

    return building;
  }

  async saveClient(dto: ClientCreateDto): Promise<Client> {
    const address = await this.saveOrGetAddress(dto);
    const client = Client.create(dto);
    client.addresses = [address];
    await client.save();
    console.log(client);

    return client;
  }

  async updateClientInfo(client: Client, dto: ClientUpdateDto): Promise<Client | null> {
    const address = await this.saveOrGetAddress(dto);
    const clientsAddresses = await this.dataSource.manager.find(Building, {
      where: {
        clients: {
          id: client.id,
        },
      },
    });
    client.addresses = [...clientsAddresses, address];
    client.save();
    return client;
  }

  async findClientByEmail(email: string): Promise<Client | null> {
    const client = await this.dataSource
      .getRepository(Client)
      .createQueryBuilder('client')
      .where('client.email = :email', { email: email })
      .getOne();

    return client;
  }
}
