/* tslint:disable */
//  This file was automatically generated and should not be edited.

export interface AddSnackMutationVariables {
  name: string;
}

export interface AddSnackMutation {
  addSnack: {
    id: number;
    name: string;
    voteCount: number;
  } | null;
}

export interface VoteForSnackMutationVariables {
  snackId: number;
}

export interface VoteForSnackMutation {
  voteFor: {
    __typename: "Vote";
    id: number;
    snack: {
      __typename: "Snack";
      id: number;
      voteCount: number;
    };
  } | null;
}

export interface DashboardSnacksQuery {
  allSnacks: Array<{
    id: number;
    name: string;
    voteCount: number;
  }> | null;
}
