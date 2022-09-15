import express, { Express } from 'express';
import * as dotenv from 'dotenv';
import { Server } from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { MySQLService } from './mySql/mySQL.service';
import { Inject, Injectable } from 'inversion-tools';
import { TYPES } from './types';
import { IConfigService } from './config/interfaces/config.service.interface';
import { IUserController } from './user/interfaces/user.controller.interface';
import { IExeptionFilter } from './errors/interfaces/exeption.filter.interface';

@Injectable()
export class App {
  app: Express;
  server: Server;
  port: number;

  constructor(
    @Inject(TYPES.ConfigService) private readonly configService: IConfigService,
    @Inject(TYPES.UserController) private readonly userController: IUserController,
    @Inject(TYPES.MySQLService) private readonly mySQLService: MySQLService,
    @Inject(TYPES.ExeptionFilter) private readonly exeptionFilter: IExeptionFilter,
  ) {
    this.app = express();
    this.port = Number(configService.get('APP_PORT'));
  }

  useMiddleWare(): void {
    this.app.use(express.json());
  }

  useRoutes(): void {
    this.app.use('/users', this.userController.router);
  }

  useExeptionFilters(): void {
    this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
  }

  async init(): Promise<void> {
    this.useMiddleWare();
    this.useRoutes();
    this.useExeptionFilters();
    await this.mySQLService.init();
    try {
      this.app.listen(5000, () => {
        console.log(`Now running on port ${this.port}`);
      });
    } catch (e) {
      console.log(e);
    }
  }

  public close(): void {
    this.server.close();
  }
}
