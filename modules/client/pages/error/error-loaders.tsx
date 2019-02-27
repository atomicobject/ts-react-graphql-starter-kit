import { asyncComponent } from "react-async-component";
import * as React from "react";
import { ErrorComponent } from "client/components/error";

export const NotFoundErrorPageRouteLoader = asyncComponent({
  resolve: async () => {
    return () => <ErrorComponent errorType="notFound" />;
  },
  name: "NotFoundErrorPage",
});
export const ServerErrorPageRouteLoader = asyncComponent({
  resolve: async () => {
    return () => <ErrorComponent errorType="serverError" />;
  },
  name: "ServerErrorPage",
});
export const UnknownUserErrorPageRouteLoader = asyncComponent({
  resolve: async () => {
    return () => <ErrorComponent errorType="unknownUser" />;
  },
  name: "UnknownUserErrorPage",
});
