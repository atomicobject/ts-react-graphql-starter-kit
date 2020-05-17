import * as React from "react";
import { FixedSizeGrid } from "react-window";
import {
  COLUMN_COUNT,
  COLUMN_WIDTH,
  ROW_HEIGHT,
  TABLE_HEIGHT,
  TABLE_WIDTH,
  ITEMS_TO_LOAD_COUNT,
} from "./constants";
import { Item, ItemData } from "./Item";
import { InfiniteLoader } from "./infinite-loader";
type Props = {
  // are there still more items to load?
  hasNextPage: boolean;
  // Callback function that knows how to load more items
  loadMoreItems: (startIndex: number, stopIndex: number) => Promise<any>;
  //Callback function determining if the item at an index is loaded
  isItemLoaded: (index: number) => boolean;
  scrollState: {
    rowIndex: number;
    columnIndex: number;
  };
  setScrollRowAndColumn: (rowIndex: number, columnIndex: number) => void;
  itemCount: number;
  itemData: ItemData;
};

export const TableContent: React.FunctionComponent<Props> = props => {
  const {
    itemCount,
    loadMoreItems,
    isItemLoaded,
    scrollState,
    setScrollRowAndColumn,
    itemData,
  } = props;
  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={100}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <FixedSizeGrid
          height={TABLE_HEIGHT}
          width={TABLE_WIDTH}
          rowHeight={ROW_HEIGHT}
          columnWidth={COLUMN_WIDTH}
          rowCount={itemCount}
          columnCount={COLUMN_COUNT}
          itemData={itemData}
          initialScrollTop={ROW_HEIGHT * scrollState.rowIndex}
          initialScrollLeft={COLUMN_WIDTH * scrollState.columnIndex}
          onItemsRendered={({
            visibleRowStartIndex,
            visibleColumnStartIndex,
            visibleRowStopIndex,
            overscanRowStopIndex,
            overscanRowStartIndex,
          }) => {
            setScrollRowAndColumn(
              visibleRowStartIndex,
              visibleColumnStartIndex
            );
            onItemsRendered({
              overscanStartIndex: overscanRowStartIndex,
              overscanStopIndex: overscanRowStopIndex,
              visibleStartIndex: visibleRowStartIndex,
              visibleStopIndex: visibleRowStopIndex,
            });
          }}
          ref={ref}
        >
          {Item}
        </FixedSizeGrid>
      )}
    </InfiniteLoader>
  );
};
