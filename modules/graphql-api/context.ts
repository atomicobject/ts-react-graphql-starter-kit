import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { SchemaLink } from "apollo-link-schema";
import { Cache } from "atomic-object/cache";
import { RedisCacheStore } from "atomic-object/cache/stores/redis";
import { buildClientLink, ClientState } from "client/graphql/state-link";
import * as config from "config";
import { GraphQLSchema } from "graphql";
import { Repositories } from "records";
import { UserId, SavedUser } from "records/user";
import { ALL_SERVICE_ACTIONS, GlobalDispatch } from "services";
import { Dispatcher } from "atomic-object/cqrs/dispatch";
import { JobQueuer, JobRunner } from "atomic-object/jobs/mapping";
import * as db from "../db";
import { executableSchema } from "./index";
export function buildLocalApollo(schema: GraphQLSchema = executableSchema) {
  return new Context().apolloClient;
}

export type ContextOpts = {
  db?: db.Knex;
  initialState?: ClientState;
  redisPrefix?: string;
  redisDisabled?: boolean;
  userId?: number;
  jobs?: JobQueuer;
  cacheStore?: CacheStore;
};

/** The graphql context type for this app.  */
export class Context {
  readonly cache: Cache;
  readonly redisPrefix: string;
  private _userId: number | null;
  readonly db: db.Knex;

  dispatch: GlobalDispatch;
  repos: Repositories;
  _jobs: undefined | JobQueuer;

  constructor(opts: ContextOpts = {}) {
    this.db = opts.db || db.getConnection();

    const { jobs } = opts;
    this._jobs = jobs;

    const apolloCache = new InMemoryCache();
    this.apolloClient = new ApolloClient({
      ssrMode: true,
      cache: apolloCache,
      link: ApolloLink.from([
        buildClientLink(apolloCache, opts && opts.initialState),
        new SchemaLink({
          schema: executableSchema,
          context: this,
        }),
      ]),
    });

    this.dispatch = new Dispatcher(this, ALL_SERVICE_ACTIONS);

    this._userId = opts.userId || null;

    /*
    You should NEVER set redisDisabled to true unless you're using a context
    outside of the application purely for access to repositories, etc.
    We added this flag to support seeding data to our dev/staging environments.
    */
    const redisDisabled = opts && opts.redisDisabled === true;
    if (!redisDisabled) {
      this.redisPrefix = opts.redisPrefix || config.get("redis.prefix");

      const cachePrefix = `${this.redisPrefix}cache:`;
      const cacheStore = opts.cacheStore || new RedisCacheStore(cachePrefix);
      this.cache = new Cache(cacheStore);
    } else {
      this.cache = null as any;
      this.redisPrefix = null as any;
      this._jobs = null as any;
    }
    this.repos = new Repositories(this.db);
  }

  get jobs(): JobQueuer {
    if (!this._jobs) {
      throw new Error("Jobs are not initialized on this Context");
    }
    return this._jobs;
  }

  get userId(): UserId {
    if (!this._userId) throw new Error("No authenticated user.");
    return this._userId;
  }

  /*
  userId should only be set for testing
  In prod, userId should only be set when creating a new context for a user 
  */
  set userId(newUserId: UserId) {
    //if env does not equal test, throw an error
    if (!__TEST__) {
      throw new Error(
        "Do not set user id in production.  User id should only be set when creating the context"
      );
    }
    this._userId = newUserId;
  }

  async getCurrentUser(): Promise<SavedUser> {
    if (!this._userId) throw new Error("No authenticated user.");
    const user = await this.repos.users.findById.load(this.userId);
    if (!user) throw new Error("No authenticated user.");
    return user;
  }

  /** An ApolloClient which can be used for local graphql queries. Does not hit the network. */
  apolloClient: ApolloClient<NormalizedCacheObject>;

  clone = () => {
    return new Context({
      db: this.db,
      redisPrefix: this.redisPrefix,
      jobs: this._jobs,
      cacheStore: this.cache.store,
    });
  };

  async destroy() {
    // currently a noop
  }
}

export class ApiContext extends Context {}
