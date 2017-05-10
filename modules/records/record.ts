import {Knex} from '../db';
import * as DataLoader from 'dataloader';

import {keyBy} from 'lodash';

/** Base type for records assumes an incrementing id */
export interface RecordBase {
  id?: number;
}

/** A Saved<Record> is a record that is from the database and therefore must have an id */
export type Saved<T extends RecordBase> = T & {
  id: number;
}

export class RepositoryBase<T extends RecordBase> {
  protected tableName: string;
  private db: Knex;

  constructor(db: Knex) {
    this.db = db;
  }

  table() {
    return this.db.table(this.tableName);
  }

  async insert(unsaved: T): Promise<Saved<T>> {
    const ids = await this.table().insert(unsaved, "id");
    return Object.assign({}, unsaved, {id: ids[0]}) as Saved<T>;
  }

  async all(): Promise<Saved<T>[]> {
    console.log(this.table().all);
    return await this.table();
  }

  findById = new DataLoader<number, Saved<T> | undefined>(async (ids) => {
    const rows: Saved<T>[] = await this.table().whereIn('id', ids)
    const byId = keyBy(rows, 'id');
    return ids.map(id => byId[id]);
  })
}
