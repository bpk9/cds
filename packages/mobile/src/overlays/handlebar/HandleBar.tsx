import { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type {
  AccessibilityActionEvent,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';
import type { ThemeVars } from '@coinbase/cds-common/core/theme';
import { handleBarHeight } from '@coinbase/cds-common/tokens/drawer';

import { useTheme } from '../../hooks/useTheme';

export type HandleBarProps = ViewProps & {
  /** Background color of the handlebar */
  background?: ThemeVars.Color;
  /** Callback fired when the handlebar is pressed via accessibility action */
  onAccessibilityPress?: () => void;
  styles?: {
    root?: PressableProps['style'];
    handle?: StyleProp<ViewStyle>;
  };
};

export const HandleBar = ({
  onAccessibilityPress,
  background = 'bgSecondary',
  style,
  styles,
  ...props
}: HandleBarProps) => {
  const theme = useTheme();
  const paddingY = theme.space[2];
  const handleBarBackgroundColor = theme.color[background];

  const handleAccessibilityAction = useCallback(
    (event: AccessibilityActionEvent) => {
      if (event.nativeEvent.actionName === 'activate') {
        onAccessibilityPress?.();
      }
    },
    [onAccessibilityPress],
  );

  const pressableStyle = useCallback(
    (state: PressableStateCallbackType) => [
      {
        alignItems: 'center' as const,
        paddingBottom: paddingY,
        paddingTop: paddingY,
      },
      style,
      typeof styles?.root === 'function' ? styles?.root(state) : styles?.root,
    ],
    [paddingY, style, styles],
  );

  const handleBarStyle = useMemo(
    () => [
      {
        width: 64,
        height: handleBarHeight,
        backgroundColor: handleBarBackgroundColor,
        borderRadius: 4,
      },
      styles?.handle,
    ],
    [handleBarBackgroundColor, styles?.handle],
  );

  return (
    <Pressable
      accessible
      accessibilityActions={onAccessibilityPress ? [{ name: 'activate' }] : undefined}
      onAccessibilityAction={handleAccessibilityAction}
      style={pressableStyle}
      testID="handleBar"
      {...props}
    >
      <View style={handleBarStyle} />
    </Pressable>
  );
};

HandleBar.displayName = 'HandleBar';
