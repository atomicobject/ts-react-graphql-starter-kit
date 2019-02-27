import { Flavor } from "helpers";
import { loaderOf, Knex } from "atomic-object/records";
import { RepositoryBase } from "records/impl/base";
import { UserRecord } from "records/impl/core";

export type UserId = Flavor<number, "User id">;

export interface UnsavedUser {
  firstName: string;
  lastName: string;
}
export interface SavedUser extends UnsavedUser {
  id: UserId;
}

export class UserRepository extends RepositoryBase(UserRecord) {}
