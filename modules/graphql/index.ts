import {shuffle} from 'lodash';

export const schema = require('./schema.graphql')
import {Query, UsersByIdQueryArgs} from './schema-types';

/** The graphql context type for this app.  */
export interface Context {
  // Add global request context, such as
  // repositories and dataloaders here.
}
/** Builds a new empty context for a request. */
export function buildContext() : Context {
  return {};
}

export const resolvers = {
  Query: {
    usersById(obj: {}, args: UsersByIdQueryArgs, context: Context): Query['usersById'] {
      console.log(args.id);
      return [
        { id: 1, name: "foo", email: "foo@example.com" },
        { id: 2, name: "bar", email: "foo@example.com" },
      ];
    },

    async answer(): Promise<Query['answer']> {
      return shuffle([1,2,3]);
    }
  }
}