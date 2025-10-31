import { useMemo } from 'react';
import { Box, HStack } from '@coinbase/cds-web/layout';
import { Pressable } from '@coinbase/cds-web/system';
import { Text } from '@coinbase/cds-web/typography/Text';
import isInternalUrl from '@docusaurus/isInternalUrl';
import Link from '@docusaurus/Link';
import { isActiveSidebarItem } from '@docusaurus/plugin-content-docs/client';
import type { Props } from '@theme/DocSidebarItem/Link';

import JSDocTag from '../../../components/page/JSDocTag';

import styles from './styles.module.css';
export default function DocSidebarItemLink({
  item,
  onItemClick,
  activePath,
  ...props
}: Props): JSX.Element {
  const { href, label, autoAddBaseUrl, customProps } = item;
  const isActive = isActiveSidebarItem(item, activePath);
  const isInternalLink = isInternalUrl(href);

  const status = customProps?.status as 'deprecated' | 'alpha' | 'new' | undefined;

  const statusTag = useMemo(() => {
    if (status) return <JSDocTag variant={status} />;
    return null;
  }, [status]);

  return (
    <Box key={label} as="li" padding={0.5}>
      <Pressable
        block
        noScaleOnPress
        aria-current={isActive ? 'page' : undefined}
        as={Link}
        autoAddBaseUrl={autoAddBaseUrl}
        background="transparent"
        borderRadius={1000}
        borderWidth={0}
        font={isActive ? 'label1' : 'label2'}
        to={href}
        {...(isInternalLink && {
          onClick: onItemClick ? () => onItemClick(item) : undefined,
        })}
        className={isActive ? styles.linkSelected : styles.link}
        {...props}
      >
        <HStack alignItems="baseline" flexWrap="wrap" gap={1} paddingX={1.5} paddingY={0.5}>
          <Text overflow="break">{label}</Text>
          {statusTag}
        </HStack>
      </Pressable>
    </Box>
  );
}
