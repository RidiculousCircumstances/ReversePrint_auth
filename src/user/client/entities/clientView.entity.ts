import { Column, DataSource, ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  expression: (datasource: DataSource) =>
    datasource.manager
      .createQueryBuilder()
      .select('client.id', 'clientId')
      .addSelect('client.isActivated', 'isAcivated')
      .addSelect('client.name', 'name')
      .addSelect('client.surname', 'surname')
      .addSelect('client.email', 'email')
      .addSelect('client.phoneNumber', 'phoneNumber')
      .addSelect('client.createdAt', 'createdAt')
      .from('client', 'client')
      .innerJoin(
        'clients_addresses',
        'clients_addresses',
        'clients_addresses.client_id = client.id',
      )
      .innerJoin('building', 'building', 'clients_addresses.address_id = building.id')
      .innerJoin('street', 'street', 'building.street_id = street.id')
      .innerJoin('city', 'city', 'city.id = street.city_id'),
})
export class PersonView {
  @ViewColumn()
  clientId: string;

  @ViewColumn()
  isAcivated: boolean;

  @ViewColumn()
  name: string;

  @ViewColumn()
  surname: string;

  @ViewColumn()
  email: string;

  @ViewColumn()
  phoneNumber: string;

  @ViewColumn()
  createdAt: string;
}

@ViewEntity({
  expression: (datasource: DataSource) =>
    datasource.manager
      .createQueryBuilder()
      .select('client.id', 'clientId')
      .addSelect('city.name', 'city')
      .addSelect('street.name', 'street')
      .addSelect('building.number', 'building')
      .from('client', 'client')
      .innerJoin(
        'clients_addresses',
        'clients_addresses',
        'clients_addresses.client_id = client.id',
      )
      .innerJoin('building', 'building', 'clients_addresses.address_id = building.id')
      .innerJoin('street', 'street', 'building.street_id = street.id')
      .innerJoin('city', 'city', 'city.id = street.city_id'),
})
export class AddressView {
  @ViewColumn()
  clientId: string;

  @ViewColumn()
  city: string;

  @ViewColumn()
  street: string;

  @ViewColumn()
  building: string;
}
