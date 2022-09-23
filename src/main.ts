import { App } from './app';
import { ConfigService } from './config/config.service';
import { MySQLService } from './mySql/mySQL.service';
import { UserController } from './user/user.controller';
import { Container } from 'inversion-tools';
import { TYPES } from './types';
import { UserService } from './user/user.service';
import { LoggerService } from './logger/logger';
import { ExeptionFilter } from './errors/exeption.filter';
import { UserRepository } from './user/user.repository';
import { MailService } from './user/mail.service';
import { TokenService } from './user/token.service';

Container.bind(TYPES.Application, App);
Container.bind(TYPES.ExeptionFilter, ExeptionFilter);
Container.bind(TYPES.UserController, UserController);
Container.bind(TYPES.LoggerService, LoggerService);
Container.bind(TYPES.UserRepository, UserRepository);
Container.bind(TYPES.ConfigService, ConfigService);
Container.bind(TYPES.MySQLService, MySQLService);
Container.bind(TYPES.MailService, MailService);
Container.bind(TYPES.TokenService, TokenService);
Container.bind(TYPES.UserService, UserService);

async function bootstrap(): Promise<App> {
  const app = Container.resolve<App>(TYPES.Application);
  await app.init();
  return app;
}

export const boot = bootstrap();
