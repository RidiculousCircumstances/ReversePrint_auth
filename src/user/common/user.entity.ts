import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { hash, compare } from 'bcryptjs';
import { Container, Inject } from 'inversion-tools';
import { TYPES } from '../../types';
import { IConfigService } from '../../config/interfaces/config.service.interface';

@Entity()
export abstract class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  public async setPassword(): Promise<void> {
    const config = Container.resolve<IConfigService>(TYPES.ConfigService);
    this.password = await hash(this.password, Number(config.get('SALT')));
  }

  public async comparePassword(pass: string): Promise<boolean> {
    return await compare(pass, this.password);
  }
}
