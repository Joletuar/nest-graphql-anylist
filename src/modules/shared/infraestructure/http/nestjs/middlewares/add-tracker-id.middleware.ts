import { NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';

export class AddTrackerIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const id = crypto.randomUUID();

    req.trackId = id;

    next();
  }
}
