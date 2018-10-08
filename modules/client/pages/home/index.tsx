import { HomePageUI } from "client/pages/home/home-page-ui";
import { Query } from "react-apollo";
import React = require("react");
import gql from "graphql-tag";
import { Test } from "client/graphql/queries/__generated__/Test";

const query = require("client/graphql/queries/Test.graphql");

/** TODO: Wrap with higher-order-components */
export const HomePage: React.SFC<{}> = () => {
  return (
    <Query<Test> query={query}>
      {props => {
        return (
          <div>
            <HomePageUI />
            The result is: {props.data!.test}
          </div>
        );
      }}
    </Query>
  );
};
