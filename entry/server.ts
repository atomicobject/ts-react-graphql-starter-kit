import { startServer } from "server";
import * as throng from "throng";
import * as config from "config";

if (config.get<boolean>("server.cluster")) {
  console.log(`Starting ${config.get<number>("server.workers")} workers`);
  throng(config.get<number>("server.workers"), startServer);
} else {
  startServer();
}
