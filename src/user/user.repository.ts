import { Inject, Injectable } from 'inversion-tools';
import { BaseEntity, DataSource } from 'typeorm';
import { MySQLService } from '../mySql/mySQL.service';
import { TYPES } from '../types';
import { AddressDto, ClientCreateDto, ClientUpdateDto } from './client/dto/client-create.dto';
import { Building } from './client/entities/building.entity';
import { City } from './client/entities/city.entity';
import { Client } from './client/entities/client.entity';
import { AddressView, PersonView } from './client/entities/clientView.entity';
import { Connection } from './client/entities/connection.entity';
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
      await city.save();
    }

    let street = await Street.findOne({ where: { name: dto.street, cityId: { id: city.id } } });

    if (!street) {
      street = Street.create({ name: dto.street, cityId: city });
      await street.save();
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
      await building.save();
    }

    return building;
  }

  async saveClient(dto: ClientCreateDto, link: string): Promise<Client> {
    const address = await this.saveOrGetAddress(dto.address);
    const client = Client.create(dto);
    client.activationLink = link;
    client.addresses = [address];
    await client.save();
    console.log(client);

    return client;
  }

  async _getAddressView(clientId: string): Promise<any> {
    const fullAddress = await this.mySQLService.dataSource.manager
      .createQueryBuilder()
      .select(['city.name', 'street.name', 'building.number'])
      .from(City, 'city')
      .innerJoin(Street, 'street', 'street.city_id = city.id')
      .innerJoin(Building, 'building', 'building.street_id = street.id')
      .innerJoin(
        'clients_addresses',
        'clients_addresses',
        'building.id = clients_addresses.address_id',
      )
      .where('clients_addresses.client_id = :clientId', { clientId })
      .getRawMany();
    return fullAddress;
  }

  async _getPersonView(clientId: string): Promise<any> {
    const fullClientInfo = await this.mySQLService.dataSource.manager
      .createQueryBuilder()
      .select([
        'client.name',
        'client.surname',
        'client.email',
        'client.phoneNumber',
        'client.createdAt',
        'client.updatedAt',
      ])
      .from(Client, 'client')
      .where('client.id = :clientId', { clientId })
      .getRawOne();
    return fullClientInfo;
  }

  async getClientView(
    clientId: string,
  ): Promise<{ addressView: AddressView[]; personView: PersonView | null }> {
    const addressView = await this.mySQLService.dataSource.manager.findBy(AddressView, {
      clientId,
    });
    const personView = await this.mySQLService.dataSource.manager.findOneBy(PersonView, {
      clientId,
    });
    return {
      personView,
      addressView,
    };
  }

  async saveConnection(
    client: Client,
    token: string,
    fingerprint: Express.IFingerprintObject,
  ): Promise<void> {
    const connection = Connection.create({
      clientId: client.id,
      refreshToken: token,
      ip: fingerprint.ip,
      fingerprint: fingerprint.fingerprint,
    });
    connection.save();
    connection.clientId = client.id;
    client.save();
  }

  async updateConnection(connection: Connection, token: string): Promise<void> {
    connection.refreshToken = token;
    await connection.save();
  }

  async updateClient(client: Client, dto: ClientUpdateDto): Promise<Client> {
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

  async saveActivationStatus(client: Client): Promise<void> {
    client.isActivated = true;
    await client.save();
  }

  async removeConnection(token: string): Promise<void> {
    const connection = await Connection.findOneBy({ refreshToken: token });
    connection?.remove();
  }
}
