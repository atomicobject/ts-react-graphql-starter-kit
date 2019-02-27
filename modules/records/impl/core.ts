import { recordInfo } from "atomic-object/records";
import { SavedUser, UnsavedUser } from "../user";

export const UserRecord = recordInfo<UnsavedUser, SavedUser>("User");
