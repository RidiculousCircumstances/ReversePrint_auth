import { Entity, Column, ManyToMany, Unique, JoinTable, OneToMany } from 'typeorm';
import { User } from '../../common/user.entity';
import { Building } from './building.entity';
import { Connection } from './connection.entity';

@Entity('client')
@Unique(['email'])
export class Client extends User {
  @Column({
    default: false,
  })
  isActivated: boolean;

  @Column({
    nullable: true,
  })
  activationLink: string;

  @ManyToMany(() => Building, (building) => building.clients, { cascade: true })
  @JoinTable({
    name: 'clients_addresses',
    joinColumn: {
      name: 'client_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'address_id',
      referencedColumnName: 'id',
    },
  })
  addresses: Building[];

  @OneToMany(() => Connection, (token) => token.clientId)
  connections: Connection[];
}
