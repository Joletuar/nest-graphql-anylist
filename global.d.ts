declare global {
  namespace NodeJS {
    interface ProcessEnv extends NodeJS.ProcessEnv {
      PORT?: number;
      NODE_ENV?: 'production' | 'development' | 'testing' | 'local';

      TYPE_ORM_HOST: string;
      TYPE_ORM_PORT: number;
      TYPE_ORM_USERNAME: string;
      TYPE_ORM_PASSWORD: string;
      TYPE_ORM_DATABASE: string;
    }
  }
}

declare module 'express' {
  interface Request {
    trackId?: string;
  }
}

export {};
