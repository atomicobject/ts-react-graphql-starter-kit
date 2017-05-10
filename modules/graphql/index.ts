import {shuffle} from 'lodash';

export const schema = require('./schema.graphql')
import {Query} from './schema-types';

export const resolvers = {
  Query: {
    retailers: () => [
      {
        id: 1,
        name: "foo",
      },
      {
        id: 2,
        name: "bar",
      },
    ],

    async answer(): Promise<Query['answer']> {
      return shuffle([1,2,3]);
    }
  }
}