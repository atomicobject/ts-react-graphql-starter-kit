import { HomePageUI, HomePageUIProps } from "client/pages/home/home-page-ui";
import { DashboardSnacksQuery } from "client/graphql-types";
import { withApollo, graphql } from "react-apollo";
import { voteForSnackMutation } from "client/graphql-mutations/vote-for-snack-mutation";
import { ApolloClient } from "apollo-client";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import partial from "lodash-es/partial";
import * as Actions from "client/actions";
import * as State from "client/state";
import { AssertAssignable } from "helpers";

/** This page is mounted in the router, so its props are from that, but we don't use them. */
type Props = {};

/** This page uses three higher-order components to provide functionality:
 *  1. withApollo – this HOC from apollo injects a reference to our GraphQL client.
 *  2. connect(...) - this HOC from redux gets access to our redux store.
 *  3. graphql – this HOC from apollo lets us subscribe to a graphql query.
 */

/** We use Apollo's withApollo higher-order-component to dependency-inject our GraphQL client. It provides these props. */
interface WithApolloProps {
  readonly client: ApolloClient<any>;
}
type PropsWithApollo = Props & WithApolloProps;

/** The props we intend to get from mapStateToProps */
type StateProps = Pick<HomePageUIProps, "popularityMode">;
/** The props we intend to get from mapDispatchToProps */
type DispatchProps = Pick<HomePageUIProps, "onVote" | "onPopularityModeChange">;
/** The combined props coming out of connect */
type ReduxConnectedProps = PropsWithApollo & DispatchProps & StateProps;

/** The props we intend to get from graphql */
type GraphQLProps = Pick<HomePageUIProps, "snacks">;

/** Assert that our combined props type is compatible with HomePageUIProps */
type _check = AssertAssignable<
  HomePageUIProps,
  ReduxConnectedProps & GraphQLProps
>;

function mapStateToProps(
  state: State.Type,
  ownProps: PropsWithApollo
): StateProps {
  return {
    popularityMode: State.popularityMode(state)
  };
}

function mapDispatchToProps(
  dispatch: Dispatch<any>,
  ownProps: PropsWithApollo
): DispatchProps {
  const { client } = ownProps;
  return {
    onVote: partial(voteForSnackMutation, client),
    onPopularityModeChange: mode => dispatch(Actions.setPopularity(mode))
  };
}
/** Higher-order component that provides the `onVote` property to wrapped component */
const connectedToRedux = connect<{}, DispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps
);

/** Higher order component that fetches the snack data and provides the `snacks` prop to wrapped component. */
const withSnacksFromGraphQL = graphql<
  ReduxConnectedProps,
  DashboardSnacksQuery,
  {},
  HomePageUIProps
>(require("client/graphql-queries/DashboardSnacks.graphql"), {
  options(props) {
    // Always refetch this query when the page is loaded (component is mounted)
    return { fetchPolicy: "cache-and-network" };
  },
  props(result): any {
    if (result.data && result.data.allSnacks) {
      return {
        snacks: result.data.allSnacks
      };
    } else {
      return {
        snacks: null
      };
    }
  }
});

/** The fully-wired home page, with  */
export const HomePage = withApollo<Props>(
  connectedToRedux(withSnacksFromGraphQL(HomePageUI))
);
