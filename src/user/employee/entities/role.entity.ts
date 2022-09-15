import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, JoinTable, ManyToMany } from 'typeorm';

export enum RoleTypes {
  Client = 'client',
  Manager = 'manager',
  Admin = 'admin',
}

@Entity('role')
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RoleTypes,
  })
  roleValue: string;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'users_roles',
    joinColumn: {
      name: 'role',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'employee',
      referencedColumnName: 'id',
    },
  })
  clients: Role[];
}
