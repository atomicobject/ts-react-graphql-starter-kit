import {Answer} from './types';
import {shuffle} from 'lodash';

export const schema = `
  type Retailer {
    id: Int,
    retailerNumber: Int,
    name: String,
    address: String,
    city: String,
    postalCode: String,
    latitude: String,
    longitude: String,
    retailerTypeId: Int,
    sellsPokerLotto: Boolean,
    acceptsCreditOrDebit: Boolean
  }

  type Query {
    retailers: [Retailer],
    answer: [Int]
  }
`;

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