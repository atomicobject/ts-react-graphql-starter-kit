/* tslint:disable */

export interface Query {
  allUsers: Array<User>;
  userById: User | null;
  answer: Array<number>;
}

export interface UserByIdQueryArgs {
  id: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
}
