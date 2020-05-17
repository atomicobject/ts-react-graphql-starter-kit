import * as React from "react";
import * as Faker from "faker";
import { Button, Typography, Grid } from "@material-ui/core";
import { ITEMS_TO_LOAD_COUNT } from "client/components/table/constants";
import { Table } from "client/components/table";

export type ItemType = {
  firstName: string;
  lastName: string;
  suffix: string;
  job: string;
};

export const TablePage: React.FC = () => {
  const [loadedItemsState, setLoadedItemsState] = React.useState<{
    hasNextPage: boolean;
    items: ItemType[];
  }>({
    hasNextPage: true,
    items: [],
  });

  const [showTable, setShowTable] = React.useState(true);

  const [scrollState, setScrollState] = React.useState({
    rowIndex: 0,
    columnIndex: 0,
  });

  let loadMoreItems = (startIndex: number, stopIndex: number): Promise<any> => {
    return new Promise(() =>
      setTimeout(() => {
        setLoadedItemsState({
          hasNextPage: loadedItemsState.items.length < ITEMS_TO_LOAD_COUNT,
          items: [...loadedItemsState.items].concat(
            new Array(10).fill(true).map(() => ({
              firstName: Faker.name.firstName(),
              lastName: Faker.name.lastName(),
              suffix: Faker.name.suffix(),
              job: Faker.name.jobDescriptor(),
            }))
          ),
        });
      }, 1500)
    );
  };

  // the item is loaded if either 1) there are no more pages or 2) there exists an item at that index
  let isItemLoaded = (index: number) =>
    !loadedItemsState.hasNextPage || !!loadedItemsState.items[index];

  const setScrollRowAndColum = React.useCallback(
    (rowIndex: number, columnIndex: number) => {
      setScrollState({ rowIndex, columnIndex });
    },
    []
  );

  const showTableCallback = React.useCallback(() => setShowTable(true), []);
  const hideTableCallback = React.useCallback(() => setShowTable(false), []);

  const { hasNextPage, items } = loadedItemsState;

  return showTable ? (
    <>
      <Button
        onClick={hideTableCallback}
        style={{ width: "100%", backgroundColor: "lightBlue" }}
      >
        HIDE TABLE
      </Button>
      {/* <Box m={2} /> */}
      <Grid style={{ padding: "20px" }}>
        <Typography>
          This grid loads the next "page" of data when the user scrolls to the
          end of loaded data.
        </Typography>
        {/* <Box m={0.5} /> */}
        <Typography>
          It also stores your scroll offset in component state so you don't lose
          your position when you navigate away and back.
        </Typography>
        {/* <Box m={3} /> */}

        <Table
          hasNextPage={hasNextPage}
          items={items}
          loadMoreItems={loadMoreItems}
          isItemLoaded={isItemLoaded}
          scrollState={scrollState}
          setScrollRowAndColumn={setScrollRowAndColum}
        />
      </Grid>
    </>
  ) : (
    <>
      <Button
        onClick={showTableCallback}
        style={{ width: "100%", backgroundColor: "lightBlue" }}
      >
        SHOW TABLE
      </Button>
      <Grid style={{ padding: "20px" }}>
        {/* <Box m={2} /> */}
        <Typography> No more table!</Typography>
      </Grid>
    </>
  );
};
