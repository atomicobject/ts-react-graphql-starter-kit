export declare global {
  namespace Express {
    interface Request {
      context?: Context;
    }
  }
}
