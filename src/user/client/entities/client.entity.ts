import { Entity, Column, ManyToMany, Unique, JoinTable } from 'typeorm';
import { User } from '../../common/user.entity';
import { Building } from './building.entity';

@Entity('client')
@Unique(['email'])
export class Client extends User {
  @Column({
    default: false,
  })
  isActive: boolean;

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
}
