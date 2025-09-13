import { Logger, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';

export class LogsMiddleware implements NestMiddleware {
  private readonly logger = new Logger('LogsMiddleware');

  use(req: Request, res: Response, next: NextFunction): void {
    const { originalUrl, method, trackId } = req;

    const startTime = process.hrtime();

    res.on('finish', () => {
      const diff = process.hrtime(startTime);
      const time = diff[0] * 1000 + diff[1] / 1000000;

      const { statusCode } = res;
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${time.toFixed(2)}ms ${trackId ? trackId : 'NO_TRACK_ID'}`,
      );
    });

    next();
  }
}
