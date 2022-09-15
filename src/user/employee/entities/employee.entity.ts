import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Role } from './role.entity';
import { User } from '../../common/user.entity';

@Entity('employee')
export class Employee extends User {
  @ManyToMany(() => Role)
  roles: Role[];
}
