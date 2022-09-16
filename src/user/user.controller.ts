import { Request, Response, NextFunction } from 'express';
import { Inject, Injectable } from 'inversion-tools';
import { HTTPError } from '../errors/HTTP.error';
import { TYPES } from '../types';
import { BaseController } from '../common/base.controller';
import { ClientCreateDto, ClientUpdateDto } from './client/dto/client-create.dto';
import { IUserController } from './interfaces/user.controller.interface';
import { IUserService } from './interfaces/user.service.interface';
import { ValidateMiddleware } from '../common/validate.middleware';
import { ClientLoginDto } from './client/dto/client-login.dto';

@Injectable()
export class UserController extends BaseController implements IUserController {
  constructor(@Inject(TYPES.UserService) private userService: IUserService) {
    super();
    this.bindRoutes([
      {
        path: '/register',
        method: 'post',
        function: this.registerClient,
        middlewares: [new ValidateMiddleware(ClientCreateDto)],
      },
      {
        path: '/login',
        method: 'post',
        function: this.login,
        middlewares: [new ValidateMiddleware(ClientLoginDto)],
      },
      {
        path: '/update/:id',
        method: 'patch',
        function: this.patchClient,
        middlewares: [new ValidateMiddleware(ClientUpdateDto)],
      },
    ]);
  }

  async login(
    { body }: Request<{}, {}, ClientLoginDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const isValid = await this.userService.validateUser(body);
    if (!isValid) {
      return next(new HTTPError(401, 'Ошибка авторизации', '[]USER_CONTROLLER'));
    }
    this.ok(res, 'Авторизация прошла успешно');
  }

  async registerClient(
    { body }: Request<{}, {}, ClientCreateDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const createdClient = await this.userService.createClient(body);
    if (!createdClient) {
      return next(
        new HTTPError(409, 'Пользователь с таким email уже существует', '[USER_CONTROLLER]'),
      );
    } else {
      this.ok(res, createdClient);
    }
  }

  async patchClient(
    { body, params }: Request<{ id: string }, {}, ClientUpdateDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    if (!body.addresses && !body.personInfo) {
      return next(
        new HTTPError(422, 'Некорректные данные обновления пользователя', '[USER_CONTROLLER]'),
      );
    }
    const patchedClient = await this.userService.updateClientInfo(params.id, body);
    if (!patchedClient) {
      return next(
        new HTTPError(404, 'Пользователь с таким email уже существует', '[USER_CONTROLLER]'),
      );
    } else {
      this.ok(res, patchedClient);
    }
  }
}
