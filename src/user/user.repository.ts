import { Inject, Injectable } from 'inversion-tools';
import { DataSource } from 'typeorm';
import { MySQLService } from '../mySql/mySQL.service';
import { TYPES } from '../types';
import { AddressDto, ClientCreateDto, ClientUpdateDto } from './client/dto/client-create.dto';
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

  private async saveOrGetAddress(dto: AddressDto): Promise<Building> {
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
    const address = await this.saveOrGetAddress(dto.address);
    const client = Client.create(dto);
    client.addresses = [address];
    await client.save();
    console.log(client);

    return client;
  }

  async updateClientInfo(client: Client, dto: ClientUpdateDto): Promise<Client | null> {
    const addresses: Building[] | null = [];

    if (dto.addresses) {
      for (const address of dto.addresses) {
        const addressItem = await this.saveOrGetAddress(address);
        addresses.push(addressItem);
      }
      const clientsAddresses = await this.dataSource.manager.find(Building, {
        where: {
          clients: {
            id: client.id,
          },
        },
      });
      client.addresses = [...clientsAddresses, ...addresses];
    }

    if (dto.personInfo) {
      const info = dto.personInfo;
      let oldInfo: keyof typeof client;
      let newInfo: keyof typeof info;

      for (newInfo in info) {
        for (oldInfo in client)
          if (oldInfo != 'addresses' && client[oldInfo] != info[newInfo] && oldInfo == newInfo) {
            client[oldInfo] = info[newInfo];
          }
      }
    }
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
