import React, { memo, useCallback, useMemo } from 'react';
import { Icon } from '@coinbase/cds-web/icons';
import { Box } from '@coinbase/cds-web/layout';
import { useToast } from '@coinbase/cds-web/overlays/useToast';
import { Link } from '@coinbase/cds-web/typography/Link';
import { useLocation } from '@docusaurus/router';
import { usePlatformContext } from '@site/src/utils/PlatformContext';
import { useAnalytics } from '@site/src/utils/useAnalytics';

/**
 * A button group that provides access to LLM-friendly documentation.
 */
export const LLMDocButtons = memo(() => {
  const { platform } = usePlatformContext();
  const toast = useToast();
  const location = useLocation();
  const { trackGtagEvent, postMetric } = useAnalytics();

  // Parse the current URL to determine doc type and title
  const { docType, title } = useMemo(() => {
    const pathname = location.pathname;
    const parts = pathname.split('/').filter(Boolean);

    // Extract doc type (first segment) and title (last segment) from URL
    // e.g., /components/Button -> { docType: 'components', title: 'Button' }
    // e.g., /components/layout/AccordionItem -> { docType: 'components', title: 'AccordionItem' }
    // e.g., /hooks/useTheme -> { docType: 'hooks', title: 'useTheme' }
    // e.g., /getting-started/installation -> { docType: 'getting-started', title: 'installation' }

    if (parts.length >= 2) {
      const docType = parts[0];
      const title = parts[parts.length - 1]; // Get the last segment
      return {
        docType,
        title,
      };
    }

    // Fallback
    return { docType: 'components', title: 'unknown' };
  }, [location.pathname]);

  // Construct the URL path to the LLM text file
  const llmDocUrl = `/llms/${platform}/${docType}/${title}.txt`;

  const trackLLMDocAction = useCallback(
    (action: 'copy' | 'view') => {
      trackGtagEvent({
        action: 'llm_doc_interaction',
        category: 'LLM Documentation',
        label: `${action}:${platform}/${docType}/${title}`,
        value: 1,
      });

      postMetric('cdsDocs', {
        command: 'llm_doc_interaction',
        arguments: action,
        context: `${platform}/${docType}/${title}`,
      });
    },
    [trackGtagEvent, postMetric, platform, docType, title],
  );

  const handleCopy = useCallback(async () => {
    try {
      // Fetch the text file content
      const response = await fetch(llmDocUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch LLM doc');
      }
      const text = await response.text();

      // Copy to clipboard
      await navigator.clipboard.writeText(text);
      toast.show('Copied to clipboard');

      trackLLMDocAction('copy');
    } catch (error) {
      console.error('Failed to copy LLM doc:', error);
      toast.show('Failed to copy to clipboard');
    }
  }, [llmDocUrl, toast, trackLLMDocAction]);

  const handleViewMarkdown = useCallback(() => trackLLMDocAction('view'), [trackLLMDocAction]);

  return (
    <Box alignItems="flex-start" gap={2}>
      <Link as="button" font="label2" onClick={handleCopy}>
        <Icon
          name="copy"
          size="s"
          style={{ display: 'inline-flex', verticalAlign: 'text-bottom' }}
        />{' '}
        Copy for LLM
      </Link>
      <Link openInNewWindow font="label2" href={llmDocUrl} onClick={handleViewMarkdown}>
        <Icon
          name="externalLink"
          size="s"
          style={{ display: 'inline-flex', verticalAlign: 'text-bottom' }}
        />{' '}
        View as Markdown
      </Link>
    </Box>
  );
});
