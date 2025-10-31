import type { ReactNode } from 'react';
import { css } from '@linaria/core';
import type { Row, Table } from '@tanstack/react-table';

import { Button } from '../../buttons';
import { Box } from '../../layout/Box';
import { HStack } from '../../layout/HStack';

export const defaultActionsColumnWidth = 200;

export type ActionColumnHeadComponentProps = {
  table: Table<any>;
};

export type ActionColumnHeadComponent = (props: ActionColumnHeadComponentProps) => ReactNode;

export type ActionColumnBodyComponentProps = {
  row: Row<any>;
};

export type ActionColumnBodyComponent = (props: ActionColumnBodyComponentProps) => ReactNode;

const defaultHeadContentCss = css`
  background-color: var(--color-bg);
  height: 100%;
  width: ${defaultActionsColumnWidth}px;
`;

const defaultBodyContentCss = css`
  align-items: center;
  background-color: var(--color-bg);
  display: flex;
  gap: 4px;
  width: ${defaultActionsColumnWidth}px;
`;

export const DefaultActionColumnHead: ActionColumnHeadComponent = () => (
  <Box className={defaultHeadContentCss} padding={1}>
    Row Actions
  </Box>
);

export const DefaultActionColumnBody: ActionColumnBodyComponent = ({ row }) => (
  <HStack className={defaultBodyContentCss} padding={1}>
    {row.getIsPinned?.() !== 'top' ? (
      <Button compact onClick={() => row.pin('top')}>
        Top
      </Button>
    ) : null}
    {row.getIsPinned?.() ? (
      <Button compact onClick={() => row.pin(false)}>
        Unpin
      </Button>
    ) : null}
    {row.getIsPinned?.() !== 'bottom' ? (
      <Button compact onClick={() => row.pin('bottom')}>
        Bottom
      </Button>
    ) : null}
  </HStack>
);
