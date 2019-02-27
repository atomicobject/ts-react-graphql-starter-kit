export enum ActionTypeKeys {
  OTHER_ACTION = "__fake_to_support_system_events__",
}
export type ActionTypes = OtherAction;

export type OtherAction = {
  readonly type: ActionTypeKeys.OTHER_ACTION;
};
