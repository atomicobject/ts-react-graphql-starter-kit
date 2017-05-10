/* tslint:disable */

export interface Query {
  usersById: Array<User>;
  answer: Array<number>;
}

export interface UsersByIdQueryArgs {
  id: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
}
