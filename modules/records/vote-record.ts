import { RepositoryBase, loaderOf } from "@atomic-object/records";
import { VoteRecord, SnackRecord } from "records";
import { SnackId } from "records/snack-record";
import * as DataLoader from "dataloader";
import { Flavor } from "helpers";
import keyBy from "lodash-es/keyBy";

export type VoteId = Flavor<number, "votes">;

export interface UnsavedVote {
  snackId: SnackId;
}
export interface SavedVote extends UnsavedVote {
  id: VoteId;
  createdAt: Date;
}

export class VoteRepository extends RepositoryBase(VoteRecord) {
  allForSnack = loaderOf(this).allBelongingTo(SnackRecord, "snackId");

  countForSnack = new DataLoader<SnackId, number>(async ids => {
    // Get one count per snack id
    const counts: { id: SnackId; count: number }[] = await this.table()
      .select("snackId", this.db.raw("COUNT(votes.id) as count"))
      .whereIn("snackId", ids)
      .groupBy("snackId");

    // Return counts in the order of incoming `ids` argument.
    const table = keyBy(counts, "snackId");
    return ids.map(id => {
      let countRec = table[id.toString()];
      return countRec ? Number(countRec.count) : 0;
    });
  });
}
