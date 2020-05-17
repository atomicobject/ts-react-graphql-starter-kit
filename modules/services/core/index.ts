import { Repositories } from "records";
import { UserId } from "records/user";
import { Context } from "graphql-api/context";

/** Used by Brand to mark a type in a readable way. */
export interface PermissionMark<PermissionT> {
  _permission: PermissionT;
}
/** Create a "flavored" version of a type. TypeScript will disallow mixing flavors, but will allow unflavored values of that type to be passed in where a flavored version is expected. This is a less restrictive form of branding. */
export type Permission<T, PermissionT> = {
  payload: T;
  userId: UserId;
} & PermissionMark<PermissionT>;
