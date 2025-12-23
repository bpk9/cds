import React, { memo, useMemo } from 'react';
import type { AccessibilityProps } from 'react-native';
import { SvgXml } from 'react-native-svg';
import type { IllustrationVariant } from '@coinbase/cds-common/types/IllustrationNames';
import type {
  HeroSquareDimension,
  PictogramDimension,
  SpotIconDimension,
  SpotRectangleDimension,
  SpotSquareDimension,
} from '@coinbase/cds-common/types/IllustrationProps';
import type { SharedProps } from '@coinbase/cds-common/types/SharedProps';
import { convertDimensionToSize } from '@coinbase/cds-common/utils/convertDimensionToSize';
import { convertSizeWithMultiplier } from '@coinbase/cds-common/utils/convertSizeWithMultiplier';
import { convertThemedSvgToHex } from '@coinbase/cds-common/utils/convertThemedSvgToHex';
import { getDefaultSizeObjectForIllustration } from '@coinbase/cds-common/utils/getDefaultSizeObjectForIllustration';
import type {
  HeroSquareName,
  PictogramName,
  SpotIconName,
  SpotRectangleName,
  SpotSquareName,
} from '@coinbase/cds-illustrations';
import { isDevelopment } from '@coinbase/cds-utils';

import { useTheme } from '../hooks/useTheme';

export type IllustrationNamesMap = {
  heroSquare: HeroSquareName;
  spotRectangle: SpotRectangleName;
  pictogram: PictogramName;
  spotSquare: SpotSquareName;
  spotIcon: SpotIconName;
};

export type IllustrationDimensionsMap = {
  heroSquare: HeroSquareDimension;
  spotSquare: SpotSquareDimension;
  spotRectangle: SpotRectangleDimension;
  pictogram: PictogramDimension;
  spotIcon: SpotIconDimension;
};

export type IllustrationBaseProps<T extends keyof IllustrationNamesMap> = SharedProps & {
  /** Name of illustration as defined in Figma */
  name: IllustrationNamesMap[T];
  /**
   * HeroSquare Default:  240x240
   * SpotSquare Default: 96x96
   * Pictogram Default: 48x48
   * SpotRectangle Default: 240x120
   *
   */
  dimension?: IllustrationDimensionsMap[T];
  /** Multiply the width & height while maintaining aspect ratio */
  scaleMultiplier?: number;
  /**
   * Fallback element to render if unable to find an illustration with the matching name
   * @default null
   * */
  fallback?: null | React.ReactElement;
};

type IllustrationConfigShape = Record<
  string,
  { light: () => string; dark: () => string; themeable?: () => string }
>;

export type IllustrationA11yProps = Pick<
  AccessibilityProps,
  'accessibilityLabel' | 'accessibilityHint'
>;

export type IllustrationBasePropsWithA11y<Type extends IllustrationVariant> =
  IllustrationBaseProps<Type> & IllustrationA11yProps;

export function createIllustration<
  Variant extends IllustrationVariant,
  Config extends IllustrationConfigShape,
>(variant: Variant, config: Config) {
  const defaultSize = getDefaultSizeObjectForIllustration(variant);

  type IllustrationProps = IllustrationBasePropsWithA11y<Variant>;

  const Illustration = memo(function Illustration({
    fallback = null,
    name,
    dimension,
    scaleMultiplier,
    testID,
    accessibilityHint,
    accessibilityLabel,
  }: IllustrationProps) {
    const theme = useTheme();
    const { activeColorScheme } = theme;
    const themeableSvgAvailable = config[name]?.['themeable'] !== undefined;
    let requiredFn = null;
    if (themeableSvgAvailable) {
      requiredFn = config[name]?.['themeable'];
    } else {
      requiredFn = config[name]?.[activeColorScheme === 'dark' ? 'dark' : 'light'];
    }

    const illustrationPalette = useMemo(
      () =>
        activeColorScheme === 'dark'
          ? (theme.darkIllustration as Record<string, string> | undefined)
          : (theme.lightIllustration as Record<string, string> | undefined),
      [activeColorScheme, theme.darkIllustration, theme.lightIllustration],
    );

    const xml = useMemo(() => requiredFn?.(), [requiredFn]);

    const themedXml = useMemo(() => {
      if (!xml || !themeableSvgAvailable || !illustrationPalette) {
        return xml;
      }

      return convertThemedSvgToHex(xml, illustrationPalette);
    }, [illustrationPalette, themeableSvgAvailable, xml]);

    const style = useMemo(() => {
      let size = defaultSize;
      if (dimension) {
        size = convertDimensionToSize(dimension);
      }
      if (scaleMultiplier) {
        size = convertSizeWithMultiplier(size, scaleMultiplier);
      }
      return size;
    }, [dimension, scaleMultiplier]);

    if (!themedXml) {
      if (isDevelopment()) {
        console.error(`Unable to find illustration with name: ${name}`);
      }
      return fallback;
    }

    return (
      <SvgXml
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="image"
        accessible={!!accessibilityLabel}
        style={style}
        testID={testID}
        xml={themedXml}
      />
    );
  });

  Illustration.displayName = `Illustration`;
  return Illustration;
}
