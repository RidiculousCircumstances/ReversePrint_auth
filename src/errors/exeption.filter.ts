import { NextFunction, Request, Response } from 'express';
import { Inject, Injectable } from 'inversion-tools';
import { ILoggerService } from '../logger/interfaces/logger.interface';
import { TYPES } from '../types';
import { HTTPError } from './HTTP.error';
import { IExeptionFilter } from './interfaces/exeption.filter.interface';

@Injectable()
export class ExeptionFilter implements IExeptionFilter {
  constructor(@Inject(TYPES.LoggerService) private readonly logger: ILoggerService) {}

  catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
    if (err instanceof HTTPError) {
      this.logger.error(`[${err.context}] Ошибка ${err.statusCode}: ${err.message}`);
      res.status(err.statusCode).send({ err: err.message });
    } else {
      this.logger.error(`${err.message}`);
      res.status(500).send({ err: err.message });
    }
  }
}
