import { MutationResolvers } from "../client-types.gen";

const setLocalName: MutationResolvers.SetLocalNameResolver = async function(
  parent,
  args,
  context,
  info
) {
  context.cache.writeData({ data: { localName: args.newName } });
  return args.newName;
};

export default {
  setLocalName,
};
