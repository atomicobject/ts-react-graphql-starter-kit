/* tslint:disable */

export interface Query {
  allUsers: Array<User>;
  userById: User | null;
  game: Game;
}

export interface UserByIdQueryArgs {
  id: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Game {
  answer: Array<number>;
}
