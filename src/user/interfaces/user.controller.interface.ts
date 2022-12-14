import { Request, Response, NextFunction, Router } from 'express';
import { ClientUpdateDto } from '../client/dto/client-create.dto';

export interface IUserController {
  router: Router;
  login: (req: Request, res: Response, next: NextFunction) => void;
  registration: (req: Request, res: Response, next: NextFunction) => void;
  update: (
    req: Request<{ id: string }, {}, ClientUpdateDto>,
    res: Response,
    next: NextFunction,
  ) => void;
}
