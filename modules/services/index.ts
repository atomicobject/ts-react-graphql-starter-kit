import {
  Actions,
  UnwrapActions,
  ActionsObjectTypes,
} from "atomic-object/cqrs/actions";
import { Dispatcher } from "atomic-object/cqrs/dispatch";

/** Aggregate of all actions in the system. Only these actions can be dispatched. */
export const ALL_SERVICE_ACTIONS = new Actions();

/** Aggregate of all background jobs in the system - used to set up job processing */
export const ALL_JOBS = ALL_SERVICE_ACTIONS.backgroundJobs;

export type GlobalActions = ActionsObjectTypes<typeof ALL_SERVICE_ACTIONS>;
export type GlobalDispatch = Dispatcher<
  UnwrapActions<typeof ALL_SERVICE_ACTIONS>
>;
