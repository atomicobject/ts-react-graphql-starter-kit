import * as React from "react";

require("./styles.scss");

export interface HomePageUIProps {}

export const HomePageUI: React.SFC<HomePageUIProps> = props => {
  return (
    <div className="home-page">
      <h2>Home</h2>

      <p>Hello!</p>
    </div>
  );
};
