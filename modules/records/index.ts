import { recordInfo } from "@atomic-object/records";
import { UnsavedVote, SavedVote } from "records/vote-record";
import { UnsavedSnack, SavedSnack } from "records/snack-record";

export const VoteRecord = recordInfo<UnsavedVote, SavedVote>("votes");
export const SnackRecord = recordInfo<UnsavedSnack, SavedSnack>("snacks");
