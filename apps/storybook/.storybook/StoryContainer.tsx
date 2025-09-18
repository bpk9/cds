import { StrictMode, useMemo } from 'react';
import type { ThemeConfig } from '@coinbase/cds-web/core/theme';
import { PortalProvider } from '@coinbase/cds-web/overlays/PortalProvider';
import { MediaQueryProvider } from '@coinbase/cds-web/system/MediaQueryProvider';
import { ThemeProvider } from '@coinbase/cds-web/system/ThemeProvider';
import { defaultHighContrastTheme } from '@coinbase/cds-web/themes/defaultHighContrastTheme';
import { defaultTheme } from '@coinbase/cds-web/themes/defaultTheme';

import type { StoryPaddingValue, ThemeBackgroundColorValue, ThemeConfigValue } from './preview';
import { useDarkMode } from './useDarkMode';

const LocalStrictMode = ({ children }: { children: React.ReactNode }) => {
  const strict = typeof process !== 'undefined' && process.env.CI !== 'true';
  return strict ? <StrictMode>{children}</StrictMode> : <>{children}</>;
};

type StorybookContext = {
  themeConfig: ThemeConfigValue;
  themeBackgroundColor: ThemeBackgroundColorValue;
  storyPadding: StoryPaddingValue;
};

const themes = {
  defaultTheme: defaultTheme,
  defaultHighContrastTheme: defaultHighContrastTheme,
} as const satisfies Record<ThemeConfigValue, ThemeConfig>;

export const StoryContainer = (
  Story: React.FC<Partial<Record<string, unknown>>>,
  context: Record<string, any>,
) => {
  const isDarkMode = useDarkMode();
  const globals = context.globals as StorybookContext;
  const { storyPadding, themeConfig } = globals;
  const theme = useMemo(() => themes[themeConfig], [themeConfig]);
  const themeBackgroundColor = globals.themeBackgroundColor;
  const backgroundColor = theme[isDarkMode ? 'darkColor' : 'lightColor'][themeBackgroundColor];

  const bodyStyle = useMemo(
    () => <style>{`body { background-color: ${backgroundColor}; }`}</style>,
    [backgroundColor],
  );

  const containerStyle = useMemo(() => ({ padding: `${storyPadding}px` }), [storyPadding]);

  return (
    <LocalStrictMode>
      <MediaQueryProvider>
        <ThemeProvider
          activeColorScheme={isDarkMode ? 'dark' : 'light'}
          display="contents"
          theme={theme}
        >
          <PortalProvider>
            {bodyStyle}
            <div style={containerStyle}>
              <Story />
            </div>
          </PortalProvider>
        </ThemeProvider>
      </MediaQueryProvider>
    </LocalStrictMode>
  );
};
