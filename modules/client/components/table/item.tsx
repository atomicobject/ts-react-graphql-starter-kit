import * as React from "react";
import { Row } from "react-table";
import { GridChildComponentProps } from "react-window";
import { ItemType } from ".";

export type ItemData = {
  rows: Row<ItemType>[];
  prepareRow: (row: Row<ItemType>) => void;
};

export const Item: React.FunctionComponent<
  Omit<GridChildComponentProps, "data"> & {
    data: ItemData;
  }
> = props => {
  const { rowIndex, columnIndex, data, style } = props;
  const { rows, prepareRow } = data;
  // get row
  const row = rows[rowIndex];
  if (!row) {
    return <div style={style}> LOADING... </div>;
  }

  if (!row.getRowProps) {
    prepareRow(row);
  }

  const column = row.cells[columnIndex];

  return <div {...column.getCellProps({ style })}>{column.render("Cell")}</div>;
};
