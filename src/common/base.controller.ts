import { Router, Response, json } from 'express';
import { Inject, Injectable } from 'inversion-tools';
import { ILoggerService } from '../logger/interfaces/logger.interface';
import { TYPES } from '../types';
import { ExpressReturnType, IControllerRoute } from './interfaces/route.interface';

export abstract class BaseController {
  private readonly _router: Router;

  get router(): Router {
    return this._router;
  }

  constructor() {
    this._router = Router();
  }

  private send<T>(res: Response, code: number, message: T): ExpressReturnType {
    res.type('application/json');
    return res.status(code).json(message);
  }

  public ok<T>(res: Response, message: T): ExpressReturnType {
    return this.send<T>(res, 200, message);
  }

  public created(res: Response): ExpressReturnType {
    return res.sendStatus(201);
  }

  protected bindRoutes(routes: IControllerRoute[]): void {
    for (const route of routes) {
      console.log(`Роут: [${route.method}] ${route.path} успешно зарегистрирован`);
      const middleware = route.middlewares?.map((m) => m.execute.bind(m));
      const handler = route.function.bind(this);
      const pipeline = middleware ? [...middleware, handler] : handler;
      this.router[route.method](route.path, pipeline);
    }
  }
}
