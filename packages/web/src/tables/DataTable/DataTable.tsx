import React, { forwardRef } from 'react';
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove } from '@dnd-kit/sortable';
import type { Table } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

import { DataTableBody } from './DataTableBody';
import { DataTableHead } from './DataTableHead';

export type DataTableProps = React.HTMLAttributes<HTMLTableElement> & {
  table: Table<any>;
  /**
   * Called when a row reorder is completed via drag and drop. Consumers should update
   * their underlying data to reflect the new order so the table re-renders accordingly.
   * Provide both the move details and the full new ids order for convenience.
   */
  onRowChange?: (args: {
    activeId: string;
    overId: string;
    oldIndex: number;
    newIndex: number;
    ids: string[];
  }) => void;
};

export const DataTable = forwardRef<HTMLTableElement, DataTableProps>(
  ({ table, onRowChange, ...props }, ref) => {
    // Only virtualize the center (unpinned) columns. Left/Right pinned columns
    // are rendered outside of the virtualized range to support sticky pinning.
    const centerColumns = table.getVisibleLeafColumns().filter((col) => !col.getIsPinned());

    //The virtualizers need to know the scrollable container element
    const tableContainerRef = React.useRef<HTMLDivElement>(null);

    //we are using a slightly different virtualization strategy for columns (compared to virtual rows) in order to support dynamic row heights
    const columnVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableCellElement>({
      count: centerColumns.length,
      estimateSize: (index) => centerColumns[index].getSize(), //estimate width of each center column for accurate scrollbar dragging
      getScrollElement: () => tableContainerRef.current,
      horizontal: true,
      overscan: 3, //how many columns to render on each side off screen each way (adjust this for performance)
    });

    const virtualColumns = columnVirtualizer.getVirtualItems();

    //different virtualization strategy for columns - instead of absolute and translateY, we add empty columns to the left and right
    let virtualPaddingLeft: number | undefined;
    let virtualPaddingRight: number | undefined;

    if (columnVirtualizer && virtualColumns?.length) {
      virtualPaddingLeft = virtualColumns[0]?.start ?? 0;
      virtualPaddingRight =
        columnVirtualizer.getTotalSize() - (virtualColumns[virtualColumns.length - 1]?.end ?? 0);
    }

    // determine if there are top pinned rows to layer header above them
    const hasTopPinnedRows = table.getRowModel().rows.some((r) => r.getIsPinned?.() === 'top');
    const [headerHeight, setHeaderHeight] = React.useState(0);

    // Current center row ids from table rows (source of truth is external data)
    const allRows = table.getRowModel().rows;
    const centerRowIds = React.useMemo(
      () => allRows.filter((r) => !r.getIsPinned?.()).map((r) => r.id),
      [allRows],
    );

    const sensors = useSensors(
      useSensor(MouseSensor, {}),
      useSensor(TouchSensor, {}),
      useSensor(KeyboardSensor, {}),
    );

    const handleDragEnd = React.useCallback(
      (event: DragEndEvent) => {
        const { active, over } = event;
        if (!active || !over || active.id === over.id) return;
        const current = centerRowIds;
        const oldIndex = current.indexOf(String(active.id));
        const newIndex = current.indexOf(String(over.id));
        if (oldIndex === -1 || newIndex === -1) return;
        const ids = arrayMove(current, oldIndex, newIndex);
        onRowChange?.({
          activeId: String(active.id),
          overId: String(over.id),
          oldIndex,
          newIndex,
          ids,
        });
      },
      [centerRowIds, onRowChange],
    );

    return (
      <div
        ref={tableContainerRef}
        style={{
          overflow: 'auto', //our scrollable table container
          position: 'relative', //needed for sticky header
          height: '500px', //should be a fixed height
        }}
      >
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          {/* Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights */}
          <table ref={ref} style={{ display: 'grid' }} {...props}>
            <DataTableHead
              columnVirtualizer={columnVirtualizer}
              isSticky={hasTopPinnedRows}
              onHeightChange={setHeaderHeight}
              table={table}
              virtualPaddingLeft={virtualPaddingLeft}
              virtualPaddingRight={virtualPaddingRight}
            />
            <DataTableBody
              columnVirtualizer={columnVirtualizer}
              headerOffsetTop={hasTopPinnedRows ? headerHeight : 0}
              table={table}
              tableContainerRef={tableContainerRef}
              virtualPaddingLeft={virtualPaddingLeft}
              virtualPaddingRight={virtualPaddingRight}
            />
          </table>
        </DndContext>
      </div>
    );
  },
);
