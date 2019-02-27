import { Context } from "graphql-api/context";
import { BlueprintCanvas } from "./canvas";
import * as Blueprint from "./blueprint";
import { AbstractRepositoryBase } from "atomic-object/records";
import * as Factory from "factory.ts";

type RequiredHooks<Unsaved, Saved> = {
  afterBuild: <Unsaved>(
    universe: ProxyUniverse,
    record: Unsaved
  ) => Promise<void>;
  afterCreate: <Saved>(universe: ProxyUniverse, record: Saved) => Promise<void>;
};
type OptionalHooks<Unsaved, Saved> = Partial<RequiredHooks<Unsaved, Saved>>;

export type RecordBlueprint<Unsaved, Saved> = {
  buildBlueprint: (universe: ProxyUniverse) => Blueprint.Blueprint<Unsaved>;
  getRepo: (ctx: Context) => AbstractRepositoryBase<any, Unsaved, Saved, any>;
} & OptionalHooks<Unsaved, Saved>;

export type RecordBlueprintFull<Unsaved, Saved> = {
  buildBlueprint: (universe: ProxyUniverse) => Blueprint.Blueprint<Unsaved>;
  getRepo: (ctx: Context) => AbstractRepositoryBase<any, Unsaved, Saved, any>;
} & RequiredHooks<Unsaved, Saved>;

export enum PickPolicy {
  InsertOrPick,
  Insert,
  Pick,
}

export function declareBlueprint<Unsaved, Saved>(
  blueprint: RecordBlueprint<Unsaved, Saved>
): RecordBlueprintFull<Unsaved, Saved> {
  return Object.assign(
    {
      afterBuild: (universe: ProxyUniverse, r: Unsaved) => r,
      afterCreate: (universe: ProxyUniverse, r: Saved) => r,
    },
    blueprint
  );
}

export class PickPolicySpec {
  default: PickPolicy;
  specializations: Map<RecordBlueprint<any, any>, PickPolicy> = new Map();

  constructor(
    defaultPolicy: PickPolicy,
    newSpecializations?: Map<RecordBlueprint<any, any>, PickPolicy>
  ) {
    this.default = defaultPolicy;
    if (newSpecializations) {
      newSpecializations.forEach((v: PickPolicy, k) =>
        this.specializations.set(k, v)
      );
    }
  }

  specializePickPolicy<Unsaved, Saved>(
    blueprint: RecordBlueprint<Unsaved, Saved>,
    policy: PickPolicy
  ): PickPolicySpec {
    return new PickPolicySpec(
      this.default,
      new Map(this.specializations).set(blueprint, policy)
    );
  }
}

const PickPolicyDefault: PickPolicySpec = new PickPolicySpec(
  PickPolicy.InsertOrPick
);

type BlueprintSequence = {
  counter: number;
};
type BlueprintUniverseState = {
  sequences: Map<RecordBlueprint<any, any>, BlueprintSequence>;
  policy: PickPolicySpec;
};

type BlueprintUniverseWithCanvasState = BlueprintUniverseState & {
  blueprints: Map<RecordBlueprint<any, any>, Blueprint.Blueprint<any>>;
  canvas: BlueprintCanvas;
};

class ProxyUniverse {
  _state: BlueprintUniverseWithCanvasState;

  constructor(
    public readonly context: Context,
    public readonly state: BlueprintUniverseWithCanvasState
  ) {
    this._state = state;
  }

  canvas = async (
    u: (c: ProxyUniverse, canvas: BlueprintCanvas) => void,
    policy?: PickPolicySpec
  ) => {
    const canvas = BlueprintCanvas.create(this._state.canvas);
    const proxy = new ProxyUniverse(this.context, {
      blueprints: new Map(),
      sequences: this._state.sequences,
      policy: policy || this._state.policy,
      canvas: canvas,
    });
    await u(proxy, canvas);
    return canvas;
  };

  specializePickPolicy<Unsaved, Saved>(
    blueprint: RecordBlueprint<Unsaved, Saved>,
    policy: PickPolicy
  ): PickPolicySpec {
    return this._state.policy.specializePickPolicy(blueprint, policy);
  }

  _lookupBlueprint<Unsaved, Saved>(
    recordBlueprint: RecordBlueprint<Unsaved, Saved>
  ): Blueprint.Blueprint<Unsaved> {
    const existing = this.state.blueprints.get(recordBlueprint);
    if (existing) {
      return existing;
    } else {
      const blueprint = recordBlueprint.buildBlueprint(this);
      this.state.blueprints.set(recordBlueprint, blueprint);
      return blueprint;
    }
  }

  _lookupSequence<Unsaved, Saved>(
    recordBlueprint: RecordBlueprint<Unsaved, Saved>
  ): BlueprintSequence {
    const existing = this.state.sequences.get(recordBlueprint);
    if (existing) {
      return existing;
    } else {
      const sequence = { counter: 0 };
      this.state.sequences.set(recordBlueprint, sequence);
      return sequence;
    }
  }

  _insert = async <Unsaved, Saved>(
    recordBlueprint: RecordBlueprintFull<Unsaved, Saved>,
    data?: Factory.RecPartial<Unsaved>
  ): Promise<Saved> => {
    const blueprint = this._lookupBlueprint(recordBlueprint);
    const sequence = this._lookupSequence(recordBlueprint);
    const built = await blueprint.build(data, sequence);
    await recordBlueprint.afterBuild(this, built);

    const savedRecord: Saved = await recordBlueprint
      .getRepo(this.context)
      .insert(built);

    await recordBlueprint.afterCreate(this, savedRecord);

    BlueprintCanvas.put(this._state.canvas, recordBlueprint, savedRecord);

    return savedRecord;
  };

  pick = async <Unsaved, Saved>(
    recordBlueprint: RecordBlueprint<Unsaved, Saved>,
    data?: Factory.RecPartial<Unsaved>
  ): Promise<Saved> => {
    const result = BlueprintCanvas.pick(this._state.canvas, recordBlueprint)!;
    if (!result) {
      throw new Error(`Error: Could not find any records in canvas`);
    }
    return result;
  };

  insertOrPick = async <Unsaved, Saved>(
    recordBlueprint: RecordBlueprintFull<Unsaved, Saved>,
    data?: Factory.RecPartial<Unsaved>
  ): Promise<Saved> => {
    const pick = BlueprintCanvas.pick(this._state.canvas, recordBlueprint);
    return pick || this._insert(recordBlueprint, data);
  };

  getPolicy = <Unsaved, Saved>(
    recordBlueprint: RecordBlueprintFull<Unsaved, Saved>
  ): PickPolicy => {
    return (
      this.state.policy.specializations.get(recordBlueprint) ||
      this._state.policy.default
    );
  };

  insert = async <Unsaved, Saved>(
    recordBlueprint: RecordBlueprintFull<Unsaved, Saved>,
    data?: Factory.RecPartial<Unsaved>,
    policy?: PickPolicy
  ): Promise<Saved> => {
    let result: any = null;
    switch (policy || this.getPolicy(recordBlueprint)) {
      case PickPolicy.Insert:
        result = await this._insert(recordBlueprint, data);
        break;
      case PickPolicy.InsertOrPick:
        result = await this.insertOrPick(recordBlueprint, data);
        break;
      case PickPolicy.Pick:
        result = await this.pick(recordBlueprint, data);
        break;
    }
    return result! as Saved;
  };
}

export class Universe {
  _state: BlueprintUniverseState;

  constructor(public readonly context: Context) {
    this._state = {
      sequences: new Map(),
      policy: PickPolicyDefault,
    };
  }

  insert = async <Unsaved, Saved>(
    recordBlueprint: RecordBlueprintFull<Unsaved, Saved>,
    data?: Factory.RecPartial<Unsaved>
  ): Promise<Saved> => {
    const canvas = await this.canvas(async universe => {
      await universe.insert(recordBlueprint, data);
    }, this._state.policy);

    return BlueprintCanvas.last(canvas, recordBlueprint)!;
  };

  canvas = async (
    u: (c: ProxyUniverse, canvas: BlueprintCanvas) => void,
    policy?: PickPolicySpec
  ) => {
    const canvas = BlueprintCanvas.create();
    const proxy = new ProxyUniverse(this.context, {
      blueprints: new Map(),
      sequences: this._state.sequences,
      policy: policy || PickPolicyDefault,
      canvas: canvas,
    });
    await u(proxy, canvas);
    return canvas;
  };
}
