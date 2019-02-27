import * as React from "react";

import { useFormikContext } from "formik";

export function useAutosave(delay: number = 3000) {
  delay = __TEST__ ? 0 : delay || 3000;

  const form = useFormikContext();

  const [autosubmitTime, setNextAutosubmitTime] = React.useState<null | Date>(
    null
  );

  // Can we submit?
  const canAutosubmit =
    !form.isSubmitting && form.dirty && form.isValid && !form.isValidating;

  React.useDebugValue(
    autosubmitTime
      ? `Next autosubmit at ${autosubmitTime}`
      : `No autosubmit scheduled`
  );

  // Perform the submission if we can currently submit.
  const submit = React.useCallback(async () => {
    if (canAutosubmit) {
      form.handleSubmit();
      form.resetForm(form.values);
    }
    setNextAutosubmitTime(null);
  }, [canAutosubmit, form.values]);

  // Mutable holder for the current submit function
  // Used on unmount. The effect can't just depend on submit,
  // or it submits constantly - every time the form state changes.
  const submitHolder = React.useMemo(() => ({ submit }), []);
  submitHolder.submit = submit;

  // Debounced save effect for periodic save when dirty.
  React.useEffect(() => {
    const handler = setTimeout(submit, delay);
    setNextAutosubmitTime(new Date(new Date().valueOf() + delay));
    return () => {
      clearTimeout(handler);
      setNextAutosubmitTime(null);
    };
  }, [delay, submit]); // Only re-call effect if value or delay changes

  // Force save on unmount
  React.useEffect(() => {
    return () => submitHolder.submit();
  }, []);
}

export const Autosave: React.FunctionComponent<{ delay?: number }> = props => {
  useAutosave(props.delay);
  return null;
};
