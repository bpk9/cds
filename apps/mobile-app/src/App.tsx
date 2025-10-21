import React, { memo, StrictMode, useCallback, useMemo, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import type { ColorScheme } from '@coinbase/cds-common/core/theme';
import { useTheme } from '@coinbase/cds-mobile/hooks/useTheme';
import { PortalProvider } from '@coinbase/cds-mobile/overlays/PortalProvider';
import { StatusBar } from '@coinbase/cds-mobile/system/StatusBar';
import { ThemeProvider } from '@coinbase/cds-mobile/system/ThemeProvider';
import { defaultTheme } from '@coinbase/cds-mobile/themes/defaultTheme';
import { Playground } from '@coinbase/ui-mobile-playground';
import { NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';

import { useFonts } from './hooks/useFonts';
import { routes as codegenRoutes } from './routes';

const linking = {
  prefixes: [Linking.createURL('/')],
};

// this code allows the use of toLocaleString() on Android
if (Platform.OS === 'android') {
  require('intl');
  require('intl/locale-data/jsonp/en-US');
}

const CdsSafeAreaProvider: React.FC<React.PropsWithChildren<unknown>> = memo(({ children }) => {
  const theme = useTheme();
  const style = useMemo(() => ({ backgroundColor: theme.color.bg }), [theme.color.bg]);
  return <SafeAreaProvider style={style}>{children}</SafeAreaProvider>;
});

const LocalStrictMode = ({ children }: { children: React.ReactNode }) => {
  const strict = process.env.CI !== 'true';
  return strict ? <StrictMode>{children}</StrictMode> : <>{children}</>;
};

const App = memo(() => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');

  const [fontsLoaded] = useFonts();

  const handleOnReady = useCallback(async () => {
    if (fontsLoaded) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LocalStrictMode>
      <ThemeProvider activeColorScheme={colorScheme} theme={defaultTheme}>
        <CdsSafeAreaProvider>
          <PortalProvider>
            <StatusBar hidden={!__DEV__} />
            <NavigationContainer linking={linking} onReady={handleOnReady}>
              <SafeAreaView
                style={{
                  backgroundColor: 'grey',
                  width: '100%',
                  height: '100%',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  padding: 16,
                  paddingBottom: 0,
                  // paddingBottom: ,
                  // position: 'relative',
                }}
              >
                <View
                  style={{
                    backgroundColor: 'white',
                    width: '100%',
                    height: 340,
                    borderRadius: 32,
                    // position: 'absolute',
                    // bottom: 0,
                    // left: 0,
                    // right: 0,
                  }}
                >
                  <View style={{ padding: 24 }}>
                    <Text>Hello</Text>
                  </View>
                </View>
              </SafeAreaView>
            </NavigationContainer>
          </PortalProvider>
        </CdsSafeAreaProvider>
      </ThemeProvider>
    </LocalStrictMode>
  );
});

export default App;
