import { Lens } from "@atomic-object/lenses";
import { Query } from "graphql-api/schema-types";
import { Guess } from "./types";

export interface Type {
  readonly gameWon: boolean;
  readonly lastGuess?: Guess;
  readonly guessSequence: number[];
  readonly answerSequence: Query["answer"];
}

export const gameWon = Lens.from<Type>().prop("gameWon");
export const lastGuess = Lens.from<Type>().prop("lastGuess");
export const guessSequence = Lens.from<Type>().prop("guessSequence");
export const answerSequence = Lens.from<Type>().prop("answerSequence");
