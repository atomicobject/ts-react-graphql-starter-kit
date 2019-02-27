import { AppShell } from "client/components/app";
import * as React from "react";
import { asyncComponent } from "react-async-component";
import { Route, Switch } from "react-router-dom";
import { AppHeader } from "./components/app-header";
import { ErrorBoundary } from "./components/error-boundary";
import {
  NotFoundErrorPageRouteLoader,
  ServerErrorPageRouteLoader,
  UnknownUserErrorPageRouteLoader,
} from "./pages/error/error-loaders";
import * as AuthRoutes from "./routes/authentication-routes";
/** Build the core app store with middlewares and reducer. Used to bootstrap the app to run and to test. */

export function App(props: {}) {
  return (
    <AppShell>
      <ErrorBoundary>
        <Switch>
          <Route
            exact
            path={AuthRoutes.USER_NOT_FOUND}
            component={UnknownUserErrorPageRouteLoader}
          />
          <Route component={RoutesWithHeader} />
        </Switch>
      </ErrorBoundary>
    </AppShell>
  );
}

/*
  Most routes in the app should live here.
  Currently, the only routes without a header are the routes that need to be rendered without making graphql requests.
  RoutesWithHeader will either match with one of the routes in our app or return an 404 not found page.
*/
function RoutesWithHeader() {
  return (
    <>
      <AppHeader />
      <Switch>
        <Route
          exact
          path="/"
          component={asyncComponent({
            resolve: async () => (await import("client/pages/home")).HomePage,
            name: "Home Page",
          })}
        />
        <Route exact path="/error" component={ServerErrorPageRouteLoader} />
        <Route component={NotFoundErrorPageRouteLoader} />
      </Switch>
    </>
  );
}
