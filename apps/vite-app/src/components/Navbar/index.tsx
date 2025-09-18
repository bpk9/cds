'use client';
import { useTheme } from '@coinbase/cds-web';
import { IconButton } from '@coinbase/cds-web/buttons';
import { Box, HStack } from '@coinbase/cds-web/layout';
import { NavigationBar, NavigationTitle } from '@coinbase/cds-web/navigation';

import { MoreMenu } from './MoreMenu';
import { UserMenu } from './UserMenu';

export const Navbar = ({
  title,
  toggleColorScheme,
}: {
  title?: React.ReactNode;
  toggleColorScheme?: () => void;
}) => {
  const theme = useTheme();
  const isDark = theme.activeColorScheme === 'dark';
  return (
    <NavigationBar
      end={
        <HStack alignItems="center" gap={1}>
          <MoreMenu />
          <IconButton name={isDark ? 'moon' : 'light'} onClick={toggleColorScheme} />
          <UserMenu />
        </HStack>
      }
    >
      <Box flexGrow={1} width="100%">
        <NavigationTitle flexGrow={1} width="100%">
          {title}
        </NavigationTitle>
      </Box>
    </NavigationBar>
  );
};
