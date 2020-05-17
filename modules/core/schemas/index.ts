import * as Ajv from "ajv";
import * as Result from "atomic-object/result";

if (__TEST__) {
  // Polyfill `require.context` in jest to simulate webpack "require all" functionality
  if (typeof require.context === "undefined") {
    const fs = require("fs");
    const path = require("path");

    (require as any).context = (
      base: any,
      scanSubDirectories: any,
      regularExpression: any
    ) => {
      const files: any = {};

      function readDirectory(directory: any) {
        fs.readdirSync(directory).forEach((file: any) => {
          const fullPath = path.resolve(directory, file);

          if (fs.statSync(fullPath).isDirectory()) {
            if (scanSubDirectories) readDirectory(fullPath);

            return;
          }

          if (!regularExpression.test(fullPath)) return;

          files[fullPath] = true;
        });
      }

      readDirectory(path.resolve(__dirname, base));

      function Module(file: any) {
        return require(file);
      }

      Module.keys = () => Object.keys(files);

      return Module;
    };
  }
}

function addInternalSchema(ajv: Ajv.Ajv, name: string, schema: any) {
  ajv.addSchema(schema, `int:${name}`);
}

export function configureAjv(ajv: Ajv.Ajv) {
  // Note that the schemas are ALSO processed by the generator in `yarn build`
  // so if you add or change this, you probably also need to change
  // scripts/json-schema-types.js
  const ctx = require.context("./", true, /\.schema\.json$/);
  for (const key of ctx.keys()) {
    const base = key.match(/([\w_-]+).schema.json$/)![1];
    addInternalSchema(ajv, base, ctx(key));
  }
}

export class SchemaError extends Error implements Ajv.ErrorObject {
  schemaPath: string;
  propertyName?: string | undefined;
  schema?: any;
  parentSchema?: object | undefined;
  data?: any;
  dataPath: string;
  params: Ajv.ErrorParameters;
  keyword: string;

  constructor(ajvError: Ajv.ErrorObject) {
    super(ajvError.message);
    this.dataPath = ajvError.dataPath;
    this.params = ajvError.params;
    this.keyword = ajvError.keyword;
    this.schemaPath = ajvError.schemaPath;
    this.data = ajvError.data;
    this.schema = ajvError.schema;
    this.propertyName = ajvError.propertyName;
  }
}
export function buildAjv(opts: Ajv.Options) {
  const ajv = new Ajv(opts);
  configureAjv(ajv);
  return ajv;
}

export const DEFAULT_AJV = buildAjv({
  jsonPointers: true,
});

export interface Validator<T> {
  isValid(o: unknown): o is T;
  from(o: unknown): Result.Type<T>;
  validate(o: unknown): T;
}

export function buildValidator<T>(args: { schema: any }): Validator<T> {
  const check = DEFAULT_AJV.compile(args.schema);
  return {
    isValid(o): o is T {
      return check(o) as boolean;
    },
    from(o) {
      return check(o) ? (o as T) : new SchemaError(check.errors![0]);
    },
    validate(o) {
      if (check(o)) {
        return o as T;
      } else {
        throw new SchemaError(check.errors![0]);
      }
    },
  };
}
