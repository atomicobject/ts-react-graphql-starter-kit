import { useTranslator } from "client/translations";

import * as React from "react";
import { SchemaBuilder } from "./core";

export function useTranslatedValidationSchema<TFormData extends object>(
  buildSchema: SchemaBuilder<TFormData>
) {
  const translator = useTranslator();

  return React.useMemo(() => buildSchema({ translator }), [
    translator,
    buildSchema,
  ]);
}
