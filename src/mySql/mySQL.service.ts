import { User } from '../user/common/user.entity';
import { DataSource } from 'typeorm';
import { Inject, Injectable } from 'inversion-tools';
import { TYPES } from '../types';
import { IConfigService } from 'src/config/interfaces/config.service.interface';
import { Client } from '../user/client/entities/client.entity';
import { City } from '../user/client/entities/city.entity';
import { Street } from '../user/client/entities/street.entity';
import { Building } from '../user/client/entities/building.entity';

@Injectable()
export class MySQLService {
  dataSource: DataSource;

  constructor(@Inject(TYPES.ConfigService) private readonly configService: IConfigService) {
    this.dataSource = new DataSource({
      type: 'mysql',
      host: configService.get('HOST'),
      port: Number(configService.get('PORT')),
      username: configService.get('USERNAME'),
      password: configService.get('PASSWORD'),
      database: configService.get('DATABASE'),
      entities: [Client, City, Street, Building, User],
      synchronize: true,
    });
  }
  async init(): Promise<void> {
    try {
      await this.dataSource.initialize();
      console.log(`Connected to MySQL on port ${this.configService.get('PORT')}`);
    } catch (e) {
      console.log(`Unable to connect to MySQL: ${e}`);
    }
  }
}
