import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Building } from './building.entity';
import { City } from './city.entity';

@Entity('street')
export class Street extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => City, (city) => city.streetIds, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'city_id', //имя первичного ключа с другой стороны
  })
  cityId: City;

  @OneToMany(() => Building, (building) => building.streetId)
  buildingIds: Building[];
}
