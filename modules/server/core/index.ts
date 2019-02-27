import * as core from "express-serve-static-core";
import * as config from "config";
const API_KEY = config.get<string>("server.apiKey");
export function handleExceptions(fn: core.RequestHandler): core.RequestHandler {
  return async (
    req: core.Request,
    res: core.Response,
    next: core.NextFunction
  ) => {
    try {
      return await fn(req, res, next);
    } catch (e) {
      res.status(422);
      // todo: rollbar
      res.send(`error! ${e}`);
    }
  };
}

export function protectWithApiKey(req: any, res: any, next: any) {
  const apiKeyHeader = req.header("ApiKey");
  if (apiKeyHeader === undefined) {
    res.status(401).send("API key required.");
  } else if (apiKeyHeader != API_KEY) {
    res.status(401).send("Bad API key.");
  } else if (apiKeyHeader == API_KEY) {
    next();
  }
}
