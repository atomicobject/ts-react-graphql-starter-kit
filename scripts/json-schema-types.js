const cbglob = require("glob");
const { compileFromFile } = require("json-schema-to-typescript");
const fs = require("fs");
const util = require("util");
const path = require("path");

const glob = util.promisify(cbglob);
const writeFile = util.promisify(fs.writeFile);

// mks 2019-01-30 - the Ajv schema resolver can get the 'types' core type
// definitions added to it directly. However this generator needs a bit more
// help: this simplistic resolver will turn all 'int:' URLs to simply the
// types.schema.json file.
const internalResolver = {
  order: 1,
  canRead: file => {
    const isInternal = file.url.indexOf("int:") == 0;
    return isInternal;
  },
  read: function(file, callback) {
    const fileBase = file.url.match(/int:([\w_-]+)/);
    if (!fileBase) {
      callback(
        new Error(
          `Something went wrong generating internal types for ${file.url}`
        )
      );
      return;
    }
    const base = fileBase[1];
    fs.readFile(
      `./modules/core/schemas/${base}.schema.json`,
      "utf8",
      (err, data) => callback(err, data)
    );
  },
};

(async () => {
  const files = await glob("./modules/**/*.schema.json");
  const refParserOptions = {
    resolve: {
      file: {
        order: 50,
      },
      http: {
        order: 100,
      },
      internal: internalResolver,
    },
  };
  const promises = files.map(async schemaFile => {
    let code = await compileFromFile(schemaFile, {
      unreachableDefinitions: true,
      $refOptions: refParserOptions,
    });
    code = code.replace(/\s*\[\w+:\s*string\]:.*/g, "");

    const customTypeImports = `
import * as DateIso from "core/date-iso";
import * as TimeIso from "core/time-iso";
`;
    code = customTypeImports + code;

    const tsFile = schemaFile.replace(/\.schema.json$/, ".gen.ts");
    await writeFile(tsFile, code);
    console.log(path.basename(schemaFile));
  });

  try {
    await Promise.all(promises);
  } catch (e) {
    console.log(e);
  }
})();
