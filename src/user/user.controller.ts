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
import { IConfigService } from '../config/interfaces/config.service.interface';
import { JWTGuard } from '../common/jwt.guard';
import { ActivatedGuard } from '../common/activated.guard';
import { FingerprintPipe } from '../common/fingerprint.pipe';

@Injectable()
export class UserController extends BaseController implements IUserController {
  constructor(
    @Inject(TYPES.UserService) private userService: IUserService,
    @Inject(TYPES.ConfigService) private readonly configService: IConfigService,
  ) {
    super();
    this.bindRoutes([
      {
        path: '/register',
        method: 'post',
        function: this.registration,
        middlewares: [new ValidateMiddleware(ClientCreateDto), new FingerprintPipe()],
      },
      {
        path: '/login',
        method: 'post',
        function: this.login,
        middlewares: [new ValidateMiddleware(ClientLoginDto), new FingerprintPipe()],
      },
      {
        path: '/update',
        method: 'post',
        function: this.update,
        middlewares: [new ValidateMiddleware(ClientUpdateDto), new JWTGuard()],
      },
      {
        path: '/logout',
        method: 'get',
        function: this.logout,
      },
      {
        path: '/activate/:link',
        method: 'get',
        function: this.activation,
      },
      {
        path: '/refresh',
        method: 'get',
        function: this.refresh,
      },
    ]);
  }

  async login(
    { body, fingerprintObject }: Request<{}, {}, ClientLoginDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const validClient = await this.userService.validate(body);
    if (validClient instanceof HTTPError) {
      return next(validClient);
    }

    const clientData = await this.userService.login(validClient, fingerprintObject);
    if (clientData instanceof HTTPError) {
      return next(clientData);
    }
    res.cookie('refreshToken', clientData.tokens?.refreshToken, {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    this.ok(res, clientData);
  }

  async registration(
    { body, fingerprintObject }: Request<{}, {}, ClientCreateDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const clientData = await this.userService.create(body, fingerprintObject);
    if (clientData instanceof HTTPError) {
      return next(clientData);
    } else {
      res.cookie('refreshToken', clientData.tokens?.refreshToken, {
        maxAge: 14 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      this.ok(res, clientData);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return next(new HTTPError(400, 'Некоррентный токен'));
    }
    await this.userService.logout(refreshToken);
    res.clearCookie('refreshToken');
    this.ok(res, 'Сессия завершена');
  }

  async activation(req: Request, res: Response, next: NextFunction): Promise<void> {
    const activationLink = req.params.link;
    const error = await this.userService.activate(activationLink);
    if (error) {
      return next(error);
    }
    return res.redirect(this.configService.get('CLIENT_URL'));
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { refreshToken } = req.cookies;
    const clientData = await this.userService.refresh(refreshToken);
    if (clientData instanceof HTTPError) {
      return next(clientData);
    }
    res.clearCookie('refreshToken');
    res.cookie('refreshToken', clientData.refreshToken, {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    this.ok(res, clientData);
  }

  async update(
    { body, user }: Request<{ id: string }, {}, ClientUpdateDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    if (!body.addresses && !body.personInfo) {
      return next(
        new HTTPError(422, 'Некорректные данные обновления пользователя', '[USER_CONTROLLER]'),
      );
    }
    const patchedClient = await this.userService.update(user.userId, body);
    if (patchedClient instanceof HTTPError) {
      return next(patchedClient);
    } else {
      this.ok(res, patchedClient);
    }
  }
}
