import * as DataLoader from "dataloader";
import * as knex from "knex";

// import keyBy from "lodash.keyby";
// import groupBy from "lodash.groupby";

import { keyBy, groupBy, compact } from "lodash-es";

export type Knex = knex;

export type IsolationLevel =
  | "READ UNCOMMITTED"
  | "READ COMMITTED"
  | "REPEATABLE READ"
  | "SERIALIZABLE";

export interface RecordInfo<Unsaved, Saved, Id extends keyof Saved> {
  _saved: Saved;
  _unsaved: Unsaved;
  idKey: Id;
  tableName: string;
}

/** Creates a record descriptor that captures the table name, primary key name, unsaved type, and saved type of a database record type. Assumes "id" as the primary key name */
export function recordInfo<Unsaved, Saved extends { id: any }>(
  tableName: string
): RecordInfo<Unsaved, Saved, "id">;

/** Creates a record descriptor that captures the table name, primary key name, unsaved type, and saved type of a database record type. */
export function recordInfo<Unsaved, Saved, Id extends keyof Saved>(
  tableName: string,
  idKey: Id
): RecordInfo<Unsaved, Saved, Id>;

/** Don't use this signature – be sure to provide unsaved and saved types. */
export function recordInfo(tableName: string, idKey?: string) {
  return { tableName, idKey: idKey || "id" } as any;
}
/** Extract the static type of a saved record from a RecordInfo */
export type SavedR<T extends { _saved: any }> = T["_saved"];
/** Extract the static type of a unsaved record from a RecordInfo */
export type UnsavedR<T extends { _unsaved: any }> = T["_unsaved"];
/** Extract the static ID key type (e.g. 'id') from a RecordInfo*/
export type IdKeyR<K extends { idKey: string }> = K["idKey"];
/** Extract the static type of the id of a record from a RecordInfo*/
export type IdTypeR<R extends RecordInfo<any, any, any>> = SavedR<R>[IdKeyR<R>];
/** Extract the runtime key name from a recordInfo */
export function idKeyOf<Id extends string>(recordInfo: { idKey: Id }) {
  return recordInfo.idKey;
}

export class LoaderFactory<
  TRepos extends RepositoriesBase,
  UnsavedDestType,
  SavedDestType,
  DestId extends keyof SavedDestType
> {
  constructor(
    public readonly repo: AbstractRepositoryBase<
      TRepos,
      UnsavedDestType,
      SavedDestType,
      DestId
    >
  ) {}
  findOneBy<K extends keyof SavedDestType>(targetKey: K) {
    return new DataLoader<SavedDestType[K], SavedDestType | null>(
      async (keyValues: any) => {
        const entries: SavedDestType[] = await this._primeAll(
          await this.repo.table().whereIn(targetKey as any, keyValues as any)
        );
        const table = keyBy(entries, targetKey);
        return keyValues.map((val: any) => table[val.toString()] || null);
      }
    );
  }

  /** Analogous to has_many in Rails */
  allBelongingTo<
    UnsavedSourceT,
    SavedSourceT,
    SourceId extends keyof SavedSourceT,
    K extends keyof SavedDestType
  >(record: RecordInfo<UnsavedSourceT, SavedSourceT, SourceId>, foreignKey: K) {
    type SourceRecord = SavedR<typeof record>;
    type IdType = IdTypeR<typeof record>;
    return new DataLoader<SourceRecord | IdType, SavedDestType[]>(
      async args => {
        const ids: IdType[] = args.map(arg =>
          typeof arg === "object"
            ? ((arg as SourceRecord)[record.idKey] as IdType)
            : (arg as any)
        );
        const records = await this._primeAll(
          await this.repo.table().whereIn(foreignKey as any, ids as any[])
        );

        const table = groupBy<SavedDestType>(records, foreignKey as any);
        const ordered = ids.map(id => table[(id as any).toString()] || []);
        return ordered;
      }
    );
  }

  /** Analogous to has_one in Rails */
  oneBelongingTo<
    SourceRecordInfo extends RecordInfo<any, any, any>,
    ForeignKey extends keyof SavedDestType
  >(record: SourceRecordInfo, foreignKey: ForeignKey) {
    type SourceRecord = SavedR<typeof record>;
    type FkType = SavedDestType[ForeignKey];
    return new DataLoader<SourceRecord | FkType, SavedDestType>(async args => {
      const ids: any = args.map(arg =>
        typeof arg === "object"
          ? ((arg as SourceRecord)[record.idKey] as FkType)
          : arg
      );
      const records = await this._primeAll(
        await this.repo.table().whereIn(foreignKey as any, ids as any[])
      );
      const table = keyBy<SavedDestType>(records, foreignKey as any);
      const ordered = ids.map((id: any) => table[(id as any).toString()]);
      return ordered;
    });
  }

  /** Analogous to belongs_to in Rails */
  owning<
    UnsavedSource,
    SavedSource,
    SourceIdKey extends keyof SavedSource,
    ForeignKey extends keyof SavedSource
  >(
    recordInfo: RecordInfo<UnsavedSource, SavedSource, SourceIdKey>,
    sourceKey: ForeignKey
  ) {
    type FkType = SavedSource[ForeignKey];
    type Filter<T, U> = T extends U ? T : never;
    // Result is nullable if the foreign key is nullable or undefined. Else non-nullable.
    type ResultType = Filter<FkType, null | undefined> extends never
      ? SavedDestType
      : null | SavedDestType;

    return new DataLoader<
      Pick<SavedSource, ForeignKey> | SavedSource[SourceIdKey],
      ResultType
    >(async sourceIdOrSourceRecords => {
      const sourceRecordsToFindById = sourceIdOrSourceRecords.filter(
        arg => typeof arg !== "object"
      ) as any;

      const sourceRecordsFromIds = await this.repo.repos
        .forRecord(recordInfo)
        .findById.loadMany(sourceRecordsToFindById);
      const sourceIdRecordTable = keyBy<any>(
        sourceRecordsFromIds,
        idKeyOf(recordInfo as any)
      );

      const destIdOrNullForMissingRelations: (FkType | null)[] = sourceIdOrSourceRecords.map(
        (arg: any) =>
          typeof arg === "object"
            ? arg[sourceKey]
            : sourceIdRecordTable[arg][sourceKey]
      );

      const records: any[] = await this.repo.findById.loadMany(compact(
        destIdOrNullForMissingRelations
      ) as any[]);

      const destIdToRecordTable = keyBy<SavedDestType | null>(
        records,
        idKeyOf(recordInfo as any)
      );
      const resultsInInputOrder = destIdOrNullForMissingRelations.map(destId =>
        destId ? destIdToRecordTable[(destId as any).toString()] : null
      );
      return resultsInInputOrder as any;
    });
  }

  /** Given a set of records for this repo type, prime all of them into the findById dataloader and return whichever records it stores. (Prime doesn't replace existing entries, so we want what's in there) */
  private async _primeAll(rows: any[]): Promise<any[]> {
    for (const row of rows) {
      this.repo.findById.prime(row[idKeyOf(this.repo.recordType as any)], row);
    }
    const ids = rows.map(row => row[idKeyOf(this.repo.recordType as any)]);

    // Return the actual objects from the findById loader
    // instead of caching multiple copies of the same record
    return await this.repo.findById.loadMany(ids);
  }
}

/** Factory to construct a DataLoader for associations returning the destination type handled by the passed in repostory */
export function loaderOf<
  TRepos extends RepositoriesBase,
  UnsavedDestType,
  SavedDestType,
  DestId extends keyof SavedDestType
>(
  repo: AbstractRepositoryBase<TRepos, UnsavedDestType, SavedDestType, DestId>
) {
  return new LoaderFactory<TRepos, UnsavedDestType, SavedDestType, DestId>(
    repo
  );
}

export abstract class TableHelpers<
  TRepos extends RepositoriesBase,
  UnsavedR,
  SavedR,
  IdKeyT extends keyof SavedR
> {
  abstract recordType: RecordInfo<UnsavedR, SavedR, IdKeyT>;
  public abstract db: Knex;
  public abstract readonly repos: TRepos;

  table() {
    return this.db.table(this.recordType.tableName);
  }

  prepToCreate(unsaved: UnsavedR): Partial<SavedR> {
    return unsaved as any;
  }

  async insert(unsaved: UnsavedR): Promise<SavedR> {
    const ids = await this.table().insert(
      this.prepToCreate(unsaved),
      idKeyOf(this.recordType as any)
    );
    return Object.assign({}, unsaved, { id: ids[0] }) as any;
  }

  async insertMany(unsaved: UnsavedR[]): Promise<SavedR[]> {
    const prep = this.prepToCreate.bind(this);
    const ids = await this.table().insert(
      unsaved.map(prep),
      idKeyOf(this.recordType as any)
    );
    const idk = idKeyOf(this.recordType as any);
    const saved = unsaved.map((unsaved, index) =>
      Object.assign({}, unsaved, { [idk]: ids[index] })
    );
    return saved as any;
  }

  async update(attrs: SavedR): Promise<SavedR> {
    let records: SavedR[];
    try {
      const id = (attrs as any)[idKeyOf(this.recordType as any) as any];
      records = await this.table()
        .where({ id: id })
        .update(attrs, "*");
    } catch (err) {
      throw new Error(err.message);
    }
    const updatedRecord = records[0] as SavedR;
    if (updatedRecord) {
      return updatedRecord;
    } else {
      throw new Error("Could not find record");
    }
  }

  async delete(...ids: SavedR[IdKeyT][]) {
    try {
      await this.table()
        .whereIn(idKeyOf(this.recordType as any), ids as any)
        .delete();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async all(): Promise<SavedR[]> {
    return await this.table();
  }

  async first(): Promise<SavedR[]> {
    return await this.table().limit(1);
  }

  async count(): Promise<number> {
    return parseInt((await this.table().count())[0].count);
  }

  findById = new DataLoader<SavedR[IdKeyT], SavedR | undefined>(async ids => {
    const rows: SavedR[] = await this.table().whereIn("id", ids as any);
    const byId = keyBy(rows, "id");
    return ids.map(id => byId[(id as any).toString()]);
  });
}

export abstract class RepositoriesBase {
  constructor(public pg: Knex) {}

  private _repoLookupMap: null | Map<
    RecordInfo<any, any, any>,
    AbstractRepositoryBase<any, any, any, any>
  > = null;

  transaction(
    func: (repos: this, transaction: knex.Transaction) => Promise<any>,
    isolationLevel: IsolationLevel = "READ COMMITTED"
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.pg.transaction(async trx => {
          if (isolationLevel != "READ COMMITTED") {
            await trx.raw(`SET TRANSACTION ISOLATION LEVEL ${isolationLevel}`);
          }
          return await func(new (this as any).constructor(trx), trx);
        });

        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
  }

  forRecord = <U, S, Id extends keyof S>(
    record: RecordInfo<U, S, Id>
  ): AbstractRepositoryBase<this, U, S, Id> => {
    if (this._repoLookupMap === null) {
      this._repoLookupMap = new Map();
      for (const property of Object.keys(this)) {
        const value = (this as any)[property];
        if (typeof value === "object" && value.recordType) {
          this._repoLookupMap.set(value.recordType, value);
        }
      }
    }

    const repo = this._repoLookupMap.get(record);
    if (repo) {
      return repo as AbstractRepositoryBase<this, U, S, Id>;
    } else {
      throw new Error("Couldn't find repository for specified record");
    }
  };
}

export interface AbstractRepositoryBase<
  TRepos extends RepositoriesBase,
  U,
  S,
  Id extends keyof S
> extends TableHelpers<TRepos, U, S, Id> {}

export function UnboundRepositoryBase<
  TRepos extends RepositoriesBase,
  U,
  S,
  Id extends keyof S
>(recordType: RecordInfo<U, S, Id>) {
  return class Repository extends TableHelpers<TRepos, U, S, Id>
    implements AbstractRepositoryBase<TRepos, U, S, Id> {
    static readonly recordType = recordType;
    static readonly tableName = recordType.tableName;
    public readonly recordType = recordType;
    public db: Knex;
    public readonly repos: TRepos;

    constructor(repos: TRepos, db?: Knex) {
      super();
      this.repos = repos;
      this.db = db || repos.pg;
      if (this.db == null) {
        throw new Error("Didn't have a DB in Repository!");
      }
    }
  };
}
