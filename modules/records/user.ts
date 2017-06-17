import { Knex } from "../db";
import { RecordBase, RepositoryBase } from "./record";

export interface UserRecord extends RecordBase {
  id?: number;
  name: string;
  email: string;
}

export class UserRepository extends RepositoryBase<UserRecord> {
  constructor(db: Knex) {
    super(db);
    this.tableName = "users";
  }
}
