import { IMiddleware } from './interfaces/middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { NON_ACIVATED_ERROR } from '../user/user.constants';
import { HTTPError } from '../errors/HTTP.error';

export class ActivatedGuard implements IMiddleware {
  execute(req: Request, res: Response, next: NextFunction): void {
    if (!req.user.isActivated) {
      return next(new HTTPError(401, NON_ACIVATED_ERROR));
    } else {
      return next();
    }
  }
}
