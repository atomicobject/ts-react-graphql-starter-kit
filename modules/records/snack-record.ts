import { RepositoryBase, loaderOf } from "@atomic-object/records";

import { SnackRecord, VoteRecord } from "records";
import { Flavor } from "helpers";

export type SnackId = Flavor<number, "snacks">;

export interface UnsavedSnack {
  name: string;
}
export interface SavedSnack extends UnsavedSnack {
  id: SnackId;
}

export class SnackRepository extends RepositoryBase(SnackRecord) {
  forVote = loaderOf(this).owning(VoteRecord, "snackId");
  byName = loaderOf(this).findOneBy("name");
}
