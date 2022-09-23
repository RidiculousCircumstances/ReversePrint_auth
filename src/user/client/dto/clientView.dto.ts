import { IJWTTokens } from 'src/user/interfaces/user.tokenService.interface';
import { AddressView, PersonView } from '../entities/clientView.entity';

export interface IClientObject {
  name: string;
}

export class ClientViewDto {
  clientId: string;
  isActivated: boolean;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  createdAt: string;

  tokens?: IJWTTokens;

  addresses: {
    city: string;
    street: string;
    building: string;
  }[] = [];

  constructor(addresses: AddressView[], person: PersonView, tokens?: IJWTTokens) {
    for (const address of addresses) {
      this.addresses.push({
        city: address.city,
        street: address.street,
        building: address.building,
      });
    }

    this.clientId = person.clientId;
    this.isActivated = person.isAcivated;
    this.name = person.name;
    this.surname = person.surname;
    this.email = person.email;
    this.phoneNumber = person.phoneNumber;
    this.createdAt = person.createdAt;

    this.tokens = tokens;
  }
}
