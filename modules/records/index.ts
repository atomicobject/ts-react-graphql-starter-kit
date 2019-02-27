import { RepositoriesBase } from "atomic-object/records";
import { EventLogRepository } from "./event-log";
import { UserRepository } from "./user";

export class Repositories extends RepositoriesBase {
  users = new UserRepository(this);
  eventLog = new EventLogRepository(this);
}
