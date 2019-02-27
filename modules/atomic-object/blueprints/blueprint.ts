type DesignFn<T, P extends keyof T> = (x: number) => PromiseLike<T[P]> | T[P];
type BlueprintDesign<T> = {
  [P in keyof T]: T[P] | Promise<T[P]> | DesignFn<T, P>
};
type PartialBlueprint<T> = { [P in keyof T]?: PartialBlueprint<T[P]> };

export class Blueprint<T> {
  private seqNum: number;
  constructor(public readonly design: BlueprintDesign<T>) {
    this.seqNum = 0;
  }

  public async build(
    item?: PartialBlueprint<T>,
    counter?: { counter: number }
  ): Promise<T> {
    const seqNum = counter ? counter.counter++ : this.seqNum++;
    const built = await this._buildOverrides<T>(item, seqNum);
    const keysForGeneration = Object.getOwnPropertyNames(this.design).reduce(
      (memo, prop) => {
        if (Object.getOwnPropertyNames(built).indexOf(prop) < 0) {
          memo.push(prop);
        }
        return memo;
      },
      new Array<string>()
    );

    for (const key of keysForGeneration) {
      const v = (this.design as any)[key];
      let value = v;
      try {
        if (
          value !== null &&
          value !== undefined &&
          typeof (value as any)["then"] === "function"
        ) {
          value = await v(seqNum);
        } else if (typeof value === "function") {
          value = await Promise.resolve(v(seqNum));
        } else {
          value = v;
        }
      } catch (e) {
        console.log(
          "Error building key",
          key,
          "for blueprint item",
          this.design,
          e
        );
      }
      (built as any)[key] = value;
    }

    return (built as any) as T;
  }

  async _buildOverrides<T>(
    item: PartialBlueprint<T> | undefined,
    seqNum: number
  ) {
    if (item === undefined || item === null) {
      return {};
    }
    const base: { [key: string]: any } = {};
    for (const key of Object.getOwnPropertyNames(item)) {
      const v = (item as any)[key];
      let value = v;
      if (!value) {
        value = v;
      } else if (typeof (value as any)["then"] === "function") {
        value = await v(seqNum);
      } else if (typeof value === "function") {
        value = await Promise.resolve(v(seqNum));
      } else {
        value = v;
      }
      base[key] = value;
    }

    return base as PartialBlueprint<T>;
  }
}
export function design<TUnsaved>(
  design: BlueprintDesign<TUnsaved>
): Blueprint<TUnsaved> {
  return new Blueprint<TUnsaved>(design);
}
