import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { NavigationIndependentTree } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthContext from "./auth/context";
import { FormProvider } from "./context/FormContext";
import { ProductsProvider } from "./context/ProductsContext";
import { ScreenProvider } from "./context/ScreenProvider";
import { UserProvider } from "./context/UserProvider";
import { VariationProvider } from "./context/VariationPlansProvider";
import AuthNavigator from "./navigations/AuthNavigator";
import MainDrawerNavigator from "./navigations/MainDrawerNavigator";

SplashScreen.preventAutoHideAsync();

interface User {
  user: {
    _id: string;
    phone: number;
    role: string;
  };
}

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [appReady, setAppReady] = useState(false);

  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    DMSans: require("../assets/fonts/DMSans-Regular.ttf"), 
  });

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors.app.primary,
      background: Colors.app.screen,
    },
  };

  useEffect(() => {
    const prepareApp = async () => {
      if (fontsLoaded) {
        await new Promise((res) => setTimeout(res, 2000)); 
        await SplashScreen.hideAsync();
        setAppReady(true);
      }
    };

    prepareApp();
  }, [fontsLoaded]);

  if (!appReady) return null;

  return (
    <NavigationIndependentTree>
      <SafeAreaProvider>
        <AuthContext.Provider value={{ user, setUser }}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <PaperProvider theme={theme}>
              {user ? (
                <ScreenProvider>
                  <UserProvider>
                    <VariationProvider>
                      <ProductsProvider>
                        <MainDrawerNavigator />
                      </ProductsProvider>
                    </VariationProvider>
                  </UserProvider>
                </ScreenProvider>
              ) : (
                <UserProvider>
                  <FormProvider>
                    <AuthNavigator />
                  </FormProvider>
                </UserProvider>
              )}
            </PaperProvider>
          </GestureHandlerRootView>
        </AuthContext.Provider>
      </SafeAreaProvider>
    </NavigationIndependentTree>
  );
}
