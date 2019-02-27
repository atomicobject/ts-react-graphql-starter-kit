import { RecordInfo, UnboundRepositoryBase } from "atomic-object/records";
import { Repositories } from "records";

export function RepositoryBase<U, S, Id extends keyof S>(
  recordType: RecordInfo<U, S, Id>
) {
  return UnboundRepositoryBase<Repositories, U, S, Id>(recordType);
}
