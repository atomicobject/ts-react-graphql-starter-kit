import { Permission } from "services/core";

// TODO move id types into the core module
export type PermissionToUpsertUser = Permission<
  void,
  "Permission to upsert user"
>;
