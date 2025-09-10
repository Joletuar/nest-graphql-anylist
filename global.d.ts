declare global {
  namespace NodeJS {
    interface ProcessEnv extends NodeJS.ProcessEnv {
      PORT?: number;
    }
  }
}

declare module 'express' {
  interface Request {
    trackId?: string;
  }
}

export {};
