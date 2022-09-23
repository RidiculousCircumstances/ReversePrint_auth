import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Client } from './client.entity';
import { Street } from './street.entity';

@Entity('building')
export class Building extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  number: string;

  @ManyToMany(() => Client, (client) => client.addresses)
  clients: Client[];

  @ManyToOne(() => Street, (street) => street.buildingIds, { cascade: true })
  @JoinColumn({
    name: 'street_id', //имя foreign key
  })
  streetId: Street;
}
