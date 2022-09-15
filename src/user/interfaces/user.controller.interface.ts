import { Request, Response, NextFunction, Router } from 'express';
import { ClientUpdateDto } from '../client/dto/client-update.dto';

export interface IUserController {
  router: Router;
  login: (req: Request, res: Response, next: NextFunction) => void;
  registerClient: (req: Request, res: Response, next: NextFunction) => void;
  patchClient: (
    req: Request<{ id: string }, {}, ClientUpdateDto>,
    res: Response,
    next: NextFunction,
  ) => void;
}
