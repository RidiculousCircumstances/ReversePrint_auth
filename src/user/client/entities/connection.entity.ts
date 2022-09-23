import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from './client.entity';

@Entity()
export class Connection extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  refreshToken: string;

  @Column()
  ip: string;

  @Column({
    nullable: true,
    length: 500,
  })
  fingerprint: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Client, (client) => client.connections, { onDelete: 'CASCADE' })
  clientId: string;
}
