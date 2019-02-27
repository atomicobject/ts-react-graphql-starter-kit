import { useFormikContext } from "formik";
import * as React from "react";
import { pick } from "lodash-es";

export const ShowFormData = () => {
  const ctx = useFormikContext();
  const values = pick(
    ctx,
    "dirty",
    "isSubmitting",
    "isValid",
    "isValidating",
    "status",
    "submitCount"
  );
  return (
    <pre>
      {JSON.stringify(ctx.values, null, 2)}

      {JSON.stringify(values, null, 2)}
    </pre>
  );
};
