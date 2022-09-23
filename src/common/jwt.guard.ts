import { Request, Response, NextFunction } from 'express';
import { Container } from 'inversion-tools';
import { JwtPayload } from 'jsonwebtoken';
import { IMiddleware } from './interfaces/middleware.interface';
import { HTTPError } from '../errors/HTTP.error';
import { TYPES } from '../types';
import { ITokenService } from '../user/interfaces/user.tokenService.interface';
import { UNAUTHORIZED_ERROR } from '../user/user.constants';

export class JWTGuard implements IMiddleware {
  tokenService: ITokenService;
  constructor() {
    this.tokenService = Container.resolve(TYPES.TokenService);
  }
  execute(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(new HTTPError(401, UNAUTHORIZED_ERROR));
    }
    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      return next(new HTTPError(401, UNAUTHORIZED_ERROR));
    }

    const clientData = this.tokenService.validate(accessToken, 'access');
    if (!clientData) {
      return next(new HTTPError(401, UNAUTHORIZED_ERROR));
    }
    const payload = clientData as JwtPayload;
    req.user = {
      userId: payload.userId,
      email: payload.email,
      isActivated: payload.isActivated,
    };
    return next();
  }
}
