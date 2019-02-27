import { Json, JsonMap } from "helpers/json";
import { Knex } from "db";
import { Repositories } from "records";
import { Action, ActionObjectTypes } from "atomic-object/cqrs/actions";

export interface UnsavedEventLog {
  type: string;
  payload: JsonMap;
  effect: JsonMap | null;
}

export interface SavedEventLog extends UnsavedEventLog {
  timestamp: string;
  index: string;
}

export type EventLogsForAction<TActions extends Action> = ActionObjectTypes<
  TActions
> & {
  effect: JsonMap | null;
};

export class EventLogRepository {
  private db: Knex;

  constructor(private repos: Repositories, db?: Knex) {
    this.db = db || repos.pg;
  }

  table() {
    return this.db.table("EventLog");
  }

  async insert(unsaved: UnsavedEventLog): Promise<SavedEventLog> {
    const [result] = await this.table().insert(unsaved, ["timestamp", "index"]);
    const returning = { ...result, ...unsaved };
    return returning;
  }

  async allWithType<K extends string, T extends JsonMap>(
    action: Action<K, T>
  ): Promise<EventLogsForAction<Action<K, T>>[]> {
    return await this.table().where({ type: action.type });
  }

  async count(): Promise<number> {
    return parseInt((await this.table().count())[0].count);
  }
}
