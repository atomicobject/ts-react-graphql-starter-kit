const camelCase = require("camelcase");

module.exports = {
  plugin: (schema, documents, config) => {
    return documents
      .map(doc => {
        if (!doc.content.definitions) return JSON.stringify(doc, null, 2);
        const docsNames = doc.content.definitions.map(def => def.name.value);

        // return `File ${doc.filePath} contains: ${docsNames.join(", ")}`;
        return doc.content.definitions.map(def => {
          try {
            let name = camelCase(def.name.value);
            name = name.charAt(0).toUpperCase() + name.slice(1);
            if (def.kind == "OperationDefinition") {
              return `
              export namespace ${name} {
                export const _variables : Variables = null as any;
                export const _result : ${
                  def.operation == "query" ? "Query" : "Mutation"
                } = null as any;
              }`
              // export const _doc = ${JSON.stringify(def, null, 2)};
            } else {
              return ""
            };
          } catch (e) {
            return `Bad name: ${def.name.value}`;
          }
        });
      })
      .join("\n");
  },
};