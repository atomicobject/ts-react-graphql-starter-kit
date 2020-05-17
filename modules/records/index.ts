import { RepositoriesBase } from "atomic-object/records";
import { UserRepository } from "./user";

export class Repositories extends RepositoriesBase {
  users = new UserRepository(this);
}
