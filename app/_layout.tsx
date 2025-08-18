import { useColorScheme } from "@/hooks/useColorScheme";
import { NavigationIndependentTree } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import AuthContext from "./auth/context";
import { FormProvider } from "./context/FormContext";
import { ProductsProvider } from "./context/ProductsContext";
import { ScreenProvider } from "./context/ScreenProvider";
import { UserProvider } from "./context/UserProvider";
import { VariationProvider } from "./context/VariationPlansProvider";
import AuthNavigator from "./navigations/AuthNavigator";
import MainDrawerNavigator from "./navigations/MainDrawerNavigator";


// ✅ Prevent auto-hide before loading
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
  const [appReady, setAppReady] = useState(false); // replaces `showSplash`

  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // ✅ Load fonts and hide splash screen properly
  useEffect(() => {
    const prepareApp = async () => {
      if (fontsLoaded) {
        await new Promise((res) => setTimeout(res, 2000)); // optional splash delay
        await SplashScreen.hideAsync();
        setAppReady(true);
      }
    };

    prepareApp();
  }, [fontsLoaded]);

 

  return (
    <NavigationIndependentTree>
      <AuthContext.Provider value={{ user, setUser }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
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
        </GestureHandlerRootView>
      </AuthContext.Provider>
    </NavigationIndependentTree>
  );
}
