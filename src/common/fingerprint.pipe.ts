import { IMiddleware } from './interfaces/middleware.interface';
import { NextFunction, Request, Response } from 'express';

export class FingerprintPipe implements IMiddleware {
  execute(req: Request, res: Response, next: NextFunction): void {
    const fingerprint = req.fingerprint?.hash;
    const ip = req.ip;

    const fingerprintObject = {
      ip: ip,
      fingerprint: String(fingerprint),
    };
    req.fingerprintObject = fingerprintObject;
    return next();
  }
}
