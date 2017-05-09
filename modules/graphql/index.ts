import {Answer} from './types';
import {shuffle} from 'lodash';
import * as fs from 'fs';

export const schema = require('./schema.gql')

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

    async answer(): Promise<Answer> {
      return shuffle([1,2,3]) as Answer;
    }
  }
}