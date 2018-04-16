import { startServer } from "server";
import * as throng from "throng";
import * as config from "config";

if (config.get<boolean>("server.cluster")) {
  throng(config.get<number>("server.workers"), startServer);
} else {
  startServer();
}
