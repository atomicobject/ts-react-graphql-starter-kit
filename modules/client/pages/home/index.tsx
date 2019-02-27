import { HomePageUI } from "client/pages/home/home-page-ui";
import * as React from "react";

const HomePageWithClick: React.SFC<{
  name: string;
}> = props => {
  const [count, setCount] = React.useState(0);

  const { name } = props;

  const handleButtonClick = () => {
    setCount(count + 1);
  };

  return (
    <HomePageUI name={name} currentCount={count} onClick={handleButtonClick} />
  );
};

/** TODO: Wrap with higher-order-components */
export const HomePage: React.SFC<{}> = () => {
  return <HomePageWithClick name={"Aziz"} />;
};
