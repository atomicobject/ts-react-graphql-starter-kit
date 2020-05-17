import * as React from "react";
import { Column, useTable } from "react-table";
import { ItemData } from "./Item";
import { TableContent } from "./content";

const columns: Column<ItemType>[] = [
  {
    Header: "Name",
    columns: [
      {
        Header: "First Name",
        accessor: "firstName",
      },
      {
        Header: "Last Name",
        accessor: "lastName",
      },
      {
        Header: "Suffix",
        accessor: "suffix",
      },
    ],
  },
  {
    Header: "Job",
    accessor: "job",
  },
];

export type ItemType = {
  firstName: string;
  lastName: string;
  suffix: string;
  job: string;
};

type Props = {
  // are there still more items to load?
  hasNextPage: boolean;
  // items loaded so far
  items: ItemType[];
  // Callback function that knows how to load more items
  loadMoreItems: (startIndex: number, stopIndex: number) => Promise<any>;
  //Callback function determining if the item at an index is loaded
  isItemLoaded: (index: number) => boolean;
  scrollState: {
    rowIndex: number;
    columnIndex: number;
  };
  setScrollRowAndColumn: (rowIndex: number, columnIndex: number) => void;
};

export const Table: React.FunctionComponent<Props> = props => {
  const {
    hasNextPage,
    items,
    loadMoreItems,
    isItemLoaded,
    scrollState,
    setScrollRowAndColumn,
  } = props;

  const itemCount = hasNextPage ? items.length + 1 : items.length;

  // using react table, could pull this up a level
  const { headers, rows, prepareRow } = useTable({
    data: items,
    columns: columns,
  });

  const itemData: ItemData = React.useMemo(
    () => ({
      headers,
      rows,
      prepareRow,
    }),
    [headers, rows, prepareRow]
  );
  return (
    <TableContent
      hasNextPage={hasNextPage}
      loadMoreItems={loadMoreItems}
      isItemLoaded={isItemLoaded}
      scrollState={scrollState}
      setScrollRowAndColumn={setScrollRowAndColumn}
      itemCount={itemCount}
      itemData={itemData}
    />
  );
};
