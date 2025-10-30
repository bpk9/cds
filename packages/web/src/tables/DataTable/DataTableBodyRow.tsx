import { css } from '@linaria/core';
import { type Row } from '@tanstack/react-table';
import { type VirtualItem, type Virtualizer } from '@tanstack/react-virtual';

import { cx } from '../../cx';

import type { ActionColumnBodyComponent } from './ActionColumnComponents';
import { DataTableBodyCell } from './DataTableBodyCell';

const bodyRowCss = css`
  display: flex;
  width: 100%;
`;

const virtualizedRowCss = css`
  left: 0;
  position: absolute;
  top: 0;
`;

const rowActionsCellCss = css`
  left: 0;
  position: sticky;
  z-index: 2;
`;

const spacerCellCss = css`
  display: flex;
`;

export type DataTableBodyRowProps = {
  ActionColumnBodyComponent: ActionColumnBodyComponent;
  actionsColumnWidth: number;
  columnVirtualizer: Virtualizer<HTMLDivElement, HTMLTableCellElement>;
  row: Row<any>;
  rowVirtualizer?: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
  virtualPaddingLeft: number | undefined;
  virtualPaddingRight: number | undefined;
  virtualRow?: VirtualItem;
  staticPosition?: boolean;
  virtualizeColumns?: boolean;
};

export const DataTableBodyRow = ({
  ActionColumnBodyComponent,
  actionsColumnWidth,
  columnVirtualizer,
  row,
  rowVirtualizer,
  virtualPaddingLeft,
  virtualPaddingRight,
  virtualRow,
  staticPosition = false,
  virtualizeColumns,
}: DataTableBodyRowProps) => {
  const visibleCells = row.getVisibleCells();
  const leftCells = visibleCells.filter((c) => c.column.getIsPinned() === 'left');
  const centerCells = visibleCells.filter((c) => !c.column.getIsPinned());
  const rightCells = visibleCells.filter((c) => c.column.getIsPinned() === 'right');

  return (
    <tr
      key={row.id}
      ref={
        staticPosition || !rowVirtualizer || !virtualRow
          ? undefined
          : (node) => rowVirtualizer.measureElement(node)
      }
      className={cx(bodyRowCss, !staticPosition && virtualRow && virtualizedRowCss)}
      data-index={staticPosition || !virtualRow ? undefined : virtualRow.index}
      style={
        staticPosition || !virtualRow
          ? undefined
          : {
              transform: `translateY(${virtualRow.start}px)`,
            }
      }
    >
      {/* Row actions sticky column */}
      <td className={rowActionsCellCss} style={{ width: actionsColumnWidth }}>
        <ActionColumnBodyComponent row={row} />
      </td>
      {/* Left pinned */}
      {leftCells.map((cell) => (
        <DataTableBodyCell key={cell.id} cell={cell} leftOffset={actionsColumnWidth} />
      ))}
      {virtualizeColumns && virtualPaddingLeft ? (
        // fake empty column to the left for virtualization scroll padding
        <td className={spacerCellCss} style={{ width: virtualPaddingLeft }} />
      ) : null}
      {virtualizeColumns
        ? columnVirtualizer.getVirtualItems().map((virtualColumn) => {
            const cell = centerCells[virtualColumn.index];
            if (!cell) return null;
            return <DataTableBodyCell key={cell.id} cell={cell} />;
          })
        : centerCells.map((cell) => <DataTableBodyCell key={cell.id} cell={cell} />)}
      {virtualizeColumns && virtualPaddingRight ? (
        // fake empty column to the right for virtualization scroll padding
        <td className={spacerCellCss} style={{ width: virtualPaddingRight }} />
      ) : null}
      {/* Right pinned */}
      {rightCells.map((cell) => (
        <DataTableBodyCell key={cell.id} cell={cell} />
      ))}
    </tr>
  );
};
