import { RecordBlueprint } from "atomic-object/blueprints";
import { first as firstElement, last as lastElement, sample } from "lodash-es";

export type BlueprintCanvas = {
  parent: BlueprintCanvas | null;
  currentSet: Map<RecordBlueprint<any, any>, any[]>;
};

export namespace BlueprintCanvas {
  export function create(parent?: BlueprintCanvas): BlueprintCanvas {
    return {
      parent: parent || null,
      currentSet: new Map(),
    };
  }

  export function getAll<Unsaved, Saved>(
    bcs: BlueprintCanvas,
    k: RecordBlueprint<Unsaved, Saved>
  ): Saved[] {
    return bcs.currentSet.get(k) || [];
  }

  export function first<Unsaved, Saved>(
    bcs: BlueprintCanvas,
    k: RecordBlueprint<Unsaved, Saved>
  ): Saved | null {
    return firstElement(getAll(bcs, k)) || null;
  }

  export function last<Unsaved, Saved>(
    bcs: BlueprintCanvas,
    k: RecordBlueprint<Unsaved, Saved>
  ): Saved | null {
    return lastElement(getAll(bcs, k)) || null;
  }

  export function put<Unsaved, Saved>(
    bcs: BlueprintCanvas,
    k: RecordBlueprint<Unsaved, Saved>,
    v: Saved
  ) {
    if (!bcs.currentSet.has(k)) {
      bcs.currentSet.set(k, []);
    }
    const collection = bcs.currentSet.get(k)!;
    collection.push(v);

    if (bcs.parent) {
      put(bcs.parent, k, v);
    }
  }

  export function pick<Unsaved, Saved>(
    bcs: BlueprintCanvas,
    k: RecordBlueprint<Unsaved, Saved>
  ): Saved {
    const rec = sample(getAll(bcs, k));
    return rec!;
  }
}
