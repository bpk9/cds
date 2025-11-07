import type { Column } from '@tanstack/react-table';

type PinningStyleOptions = {
  hasLeftOverflow?: boolean;
  hasRightOverflow?: boolean;
};

//These are the important styles to make sticky column pinning work!
//Apply styles like this using your CSS strategy of choice with this kind of logic to head cells, data cells, footer cells, etc.
//View the index.css file for more needed styles such as border-collapse: separate
export const getColumnPinningStyles = (
  column: Column<any>,
  leftOffset: number = 0,
  { hasLeftOverflow = false, hasRightOverflow = false }: PinningStyleOptions = {},
): React.CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right');

  const showRightShadow = isLastLeftPinnedColumn && hasLeftOverflow;
  const showLeftShadow = isFirstRightPinnedColumn && hasRightOverflow;

  return {
    boxShadow: showRightShadow
      ? '8px 0 12px 0 rgba(91, 97, 110, 0.12)'
      : showLeftShadow
        ? '-8px 0 12px 0 rgba(91, 97, 110, 0.12)'
        : undefined,
    // this is used to clip the shadow to the left/right of the cell
    clipPath: showRightShadow
      ? 'inset(0 -15px 0 0)'
      : showLeftShadow
        ? 'inset(0 0 0 -15px)'
        : undefined,
    left: isPinned === 'left' ? `${leftOffset + column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
};
