import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { Animated, Modal, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import type {
  ModalProps,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {
  drawerAnimationDefaultDuration,
  MAX_OVER_DRAG,
} from '@coinbase/cds-common/animation/drawer';
import {
  OverlayContentContext,
  type OverlayContentContextValue,
} from '@coinbase/cds-common/overlays/OverlayContentContext';
import {
  horizontalDrawerPercentageOfView,
  verticalDrawerPercentageOfView as defaultVerticalDrawerPercentageOfView,
} from '@coinbase/cds-common/tokens/drawer';
import type { PinningDirection, SharedProps } from '@coinbase/cds-common/types';

import { useTheme } from '../../hooks/useTheme';
import { Box } from '../../layout/Box';
import { HandleBar } from '../handlebar/HandleBar';
import { Overlay } from '../overlay/Overlay';
import { useOverlayAnimation } from '../overlay/useOverlayAnimation';

import { DrawerStatusBar } from './DrawerStatusBar';
import { useDrawerAnimation } from './useDrawerAnimation';
import { useDrawerPanResponder } from './useDrawerPanResponder';
import { useDrawerSpacing } from './useDrawerSpacing';

export type DrawerRenderChildren = React.FC<{ handleClose: () => void }>;

export type DrawerRefBaseProps = {
  /** ref callback that animates out the drawer */
  handleClose: () => void;
};

export type DrawerBaseProps = SharedProps &
  Omit<ModalProps, 'onRequestClose' | 'children'> & {
    /** Component to render as the Modal content */
    children: DrawerRenderChildren | React.ReactNode;
    /**
     * Pin the modal to one side of the screen
     * @default bottom
     * */
    pin: PinningDirection;
    /**
     * Prevents a user from dismissing the drawer by pressing the overlay or swiping
     * @default false
     */
    preventDismissGestures?: boolean;
    /**
     * Prevents a user from dismissing the drawer by pressing hardware back button on Android
     * @default false
     */
    preventHardwareBackBehaviorAndroid?: boolean;
    /**
     * The HandleBar can be rendered inside or outside the drawer.
     * @default 'outside'
     */
    handleBarVariant?: 'inside' | 'outside';
    /**
     * The HandleBar by default only is used for a bottom pinned drawer. This removes it.
     * @default false
     * */
    hideHandleBar?: boolean;
    /** Action that will happen when drawer is dismissed */
    onCloseComplete: () => void;
    /**
     * Prevents the Drawer from capturing pan gestures on children. Set to true when using a ScrollView as a child
     * @default false
     */
    disableCapturePanGestureToDismiss?: boolean;
    /** Callback fired when the overlay is pressed, or swipe to close */
    onBlur?: () => void;

    /**
     * Allow user of component to define maximum percentage of screen that can be taken up by the Drawer
     * @example if you want a Drawer to take up 50% of the screen, you would pass a value of `0.5`
     */
    verticalDrawerPercentageOfView?: number;
    /**
     * Accessibility label for handlebar
     * @example This is a handlebar, double tap to dismiss the tray.
     */
    handleBarAccessibilityLabel?: string;
    /**
     * StickyFooter to be rendered at bottom of Drawer
     * @deprecated Use TrayStickyFooter as a Tray child instead.
     */
    stickyFooter?: DrawerRenderChildren | React.ReactNode;
  };

export type DrawerProps = DrawerBaseProps & {
  styles?: {
    root?: StyleProp<ViewStyle>;
    overlay?: StyleProp<ViewStyle>;
    container?: StyleProp<ViewStyle>;
    handleBar?: PressableProps['style'];
    handleBarHandle?: StyleProp<ViewStyle>;
    drawer?: StyleProp<ViewStyle>;
  };
};

const overlayContentContextValue: OverlayContentContextValue = {
  isDrawer: true,
};

export const Drawer = memo(
  forwardRef<DrawerRefBaseProps, DrawerProps>(function Drawer(
    {
      children,
      pin = 'bottom',
      onCloseComplete,
      preventDismissGestures = false,
      preventHardwareBackBehaviorAndroid = false,
      handleBarVariant = 'outside',
      hideHandleBar = false,
      disableCapturePanGestureToDismiss = false,
      onBlur,
      verticalDrawerPercentageOfView = defaultVerticalDrawerPercentageOfView,
      handleBarAccessibilityLabel = 'Dismiss',
      style,
      styles,
      ...props
    },
    ref,
  ) {
    const { activeColorScheme } = useTheme();
    const { width, height } = useWindowDimensions();
    const isAndroid = Platform.OS === 'android';

    const {
      drawerAnimation,
      animateDrawerOut,
      animateDrawerIn,
      drawerAnimationStyles,
      animateSwipeToClose,
    } = useDrawerAnimation(pin, verticalDrawerPercentageOfView);
    const [opacityAnimation, animateOverlayIn, animateOverlayOut] = useOverlayAnimation(
      drawerAnimationDefaultDuration,
    );
    const spacingStyle = useDrawerSpacing(pin);
    const isMounted = useRef(false);

    const handleClose = useCallback(() => {
      Animated.parallel([animateDrawerOut, animateOverlayOut]).start(({ finished }) => {
        if (finished) {
          isMounted.current = false;
          onCloseComplete?.();
        }
      });
    }, [animateDrawerOut, animateOverlayOut, onCloseComplete]);

    const handleRequestClose = useCallback(
      () => (preventHardwareBackBehaviorAndroid && isAndroid ? undefined : handleClose()),
      [preventHardwareBackBehaviorAndroid, handleClose, isAndroid],
    );

    const handleSwipeToClose = useCallback(() => {
      if (!preventDismissGestures) {
        Animated.parallel([animateSwipeToClose, animateOverlayOut]).start(({ finished }) => {
          if (finished) {
            isMounted.current = false;
            onCloseComplete?.();
          }
        });
      }
    }, [preventDismissGestures, animateSwipeToClose, animateOverlayOut, onCloseComplete]);

    useEffect(() => {
      if (!isMounted.current) {
        Animated.parallel([animateOverlayIn, animateDrawerIn]).start(({ finished }) => {
          if (finished) {
            isMounted.current = true;
          }
        });
      }
    }, [drawerAnimation, animateDrawerIn, animateOverlayIn]);

    const panGestureHandlers = useDrawerPanResponder({
      pin,
      drawerAnimation,
      animateDrawerIn,
      disableCapturePanGestureToDismiss,
      onBlur,
      handleSwipeToClose,
      opacityAnimation,
      verticalDrawerPercentageOfView,
    });

    const isPinHorizontal = pin === 'left' || pin === 'right';
    const showHandleBar = !hideHandleBar && pin === 'bottom';
    const showHandleBarOutside = showHandleBar && handleBarVariant === 'outside';
    const showHandleBarInside = showHandleBar && handleBarVariant === 'inside';

    // leave 15% of the screenwidth as open area for menu drawer
    const horizontalDrawerWidth = useMemo(
      () => width * horizontalDrawerPercentageOfView + MAX_OVER_DRAG,
      [width],
    );
    // drawer will automatically size itself based on content, but will cap at 75% of viewport height (can override)
    const verticalDrawerMaxHeight = useMemo(
      () => height * verticalDrawerPercentageOfView + MAX_OVER_DRAG,
      [height, verticalDrawerPercentageOfView],
    );

    const getPanGestureHandlers = !preventDismissGestures
      ? panGestureHandlers.panHandlers
      : undefined;

    const handleOverlayPress = useCallback(() => {
      if (!preventDismissGestures) {
        onBlur?.();
        handleClose();
      }
    }, [handleClose, preventDismissGestures, onBlur]);

    useImperativeHandle(ref, () => ({ handleClose }), [handleClose]);

    const content = useMemo(
      () => (typeof children === 'function' ? children({ handleClose }) : children),
      [children, handleClose],
    );

    const rootStyle = useMemo(() => [style, styles?.root], [style, styles?.root]);

    const containerStyle = useMemo(
      () => [drawerAnimationStyles, styles?.container],
      [drawerAnimationStyles, styles?.container],
    );

    const drawerStyle = useMemo(
      () => [
        spacingStyle,
        showHandleBarOutside && { overflow: 'visible' as const },
        styles?.drawer,
      ],
      [spacingStyle, showHandleBarOutside, styles?.drawer],
    );

    const handleBar = useMemo(
      () => (
        <HandleBar
          accessibilityLabel={handleBarAccessibilityLabel}
          accessibilityRole="button"
          background={showHandleBarInside ? 'bgInverse' : undefined}
          onAccessibilityPress={handleClose}
          pointerEvents={showHandleBarInside ? 'none' : 'auto'}
          styles={{
            root: styles?.handleBar,
            handle: [
              showHandleBarInside && {
                width: 32,
                // We use a semi-opaque bgInverse for the background when handleBarVariant="inside"
                opacity: 0.4,
              },
              styles?.handleBarHandle,
            ],
          }}
        />
      ),
      [showHandleBarInside, handleBarAccessibilityLabel, handleClose, styles?.handleBarHandle],
    );

    return (
      <Modal
        hardwareAccelerated
        transparent
        visible
        accessibilityRole="alert"
        animationType="none"
        onRequestClose={handleRequestClose}
        style={rootStyle}
        {...props}
      >
        <OverlayContentContext.Provider value={overlayContentContextValue}>
          <DrawerStatusBar visible pin={pin} />
          <Overlay
            onTouchStart={handleOverlayPress}
            opacity={opacityAnimation}
            style={styles?.overlay}
            testID="drawer-overlay"
          />
          <Box
            {...getPanGestureHandlers}
            animated
            // close modal when user performs the "escape" accessibility gesture
            // https://reactnative.dev/docs/accessibility#onaccessibilityescape-ios
            onAccessibilityEscape={handleClose}
            pin={pin}
            style={containerStyle}
            width={isPinHorizontal ? horizontalDrawerWidth : '100%'}
          >
            {showHandleBarOutside && handleBar}
            <Box
              borderRadius={isPinHorizontal ? 0 : 600}
              bordered={activeColorScheme === 'dark'}
              elevation={2}
              maxHeight={!isPinHorizontal ? verticalDrawerMaxHeight : '100%'}
              style={drawerStyle}
            >
              {showHandleBarInside && handleBar}
              {content}
            </Box>
          </Box>
        </OverlayContentContext.Provider>
      </Modal>
    );
  }),
);
