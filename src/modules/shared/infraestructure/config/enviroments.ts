import { ConfigFactory } from '@nestjs/config';

export const enviroments = {
  PORT: process.env['PORT'] ?? 3000,
  NODE_ENV: process.env['NODE_ENV'] ?? 'local',
};

export const EnviromentsFactory: ConfigFactory = () => enviroments;

export default enviroments;
