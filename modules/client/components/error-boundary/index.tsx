import * as Logger from "atomic-object/logger";
import * as React from "react";
import { ErrorComponent } from "../error";

export type Props = {
  onError?: (error: Error, info: React.ErrorInfo) => void;
  children: JSX.Element;
};

const initialState = { hasError: false };
type State = Readonly<typeof initialState>;

export class ErrorBoundary extends React.Component<Props, State> {
  readonly state: State = initialState;

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    Logger.error(error, info);

    if (this.props.onError) {
      this.props.onError(error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorComponent errorType="serverError" />;
    }

    return this.props.children;
  }
}
