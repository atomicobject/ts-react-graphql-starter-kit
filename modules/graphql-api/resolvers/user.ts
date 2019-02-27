import { User } from "client/graphql/types.gen";

export type MinimalUser = {
  id: User["id"];
  firstName: User["firstName"];
  lastName: User["lastName"];
};
