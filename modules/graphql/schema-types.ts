/* tslint:disable */

export interface Query {
  users: Array<User>;
  answer: Array<number>;
}

export interface User {
  id: number;
  name: string;
  email: string;
}
