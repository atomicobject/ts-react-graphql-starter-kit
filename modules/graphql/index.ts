import {shuffle} from 'lodash';

export const schema = require('./schema.graphql')
import {Query} from './schema-types';

export const resolvers = {
  Query: {
    users(): Query['users'] {
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