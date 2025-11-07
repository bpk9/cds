import React, { memo } from 'react';
import { css } from '@linaria/core';

import { Icon } from '../icons/Icon';
import { Box } from '../layout/Box';
import { VStack } from '../layout/VStack';

export type TableCellSortIconProps = {
  direction?: React.TdHTMLAttributes<HTMLTableCellElement>['aria-sort'];
};

const disabledCss = css`
  opacity: 0.5;
`;

export const TableCellSortIcon = memo(({ direction }: TableCellSortIconProps) => {
  const upColor = direction === 'ascending' ? 'fgPrimary' : 'fgMuted';
  const downColor = direction === 'descending' ? 'fgPrimary' : 'fgMuted';

  return (
    <VStack gap={0.5}>
      <Box marginBottom={-0.5}>
        <Icon
          active
          aria-hidden="true"
          // TODO confirm this change is ok for backwards compatibility
          className={direction === 'descending' ? disabledCss : undefined}
          color={upColor}
          name="sortUpCenter"
          size="xs"
          testID="table-sort-icon-up"
        />
      </Box>
      <Box marginTop={-0.5}>
        <Icon
          active
          aria-hidden="true"
          className={direction === 'ascending' ? disabledCss : undefined}
          color={downColor}
          name="sortDownCenter"
          size="xs"
          testID="table-sort-icon-down"
        />
      </Box>
    </VStack>
  );
});

TableCellSortIcon.displayName = 'TableCellSortIcon';
