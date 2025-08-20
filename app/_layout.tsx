import { useColorScheme } from "@/hooks/useColorScheme";
import { NavigationIndependentTree } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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


  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });


  useEffect(() => {
    const prepareApp = async () => {
      if (fontsLoaded) {
  await new Promise((res) => setTimeout(res, 2000));
  await SplashScreen.hideAsync();

      }
    };

    prepareApp();
  }, [fontsLoaded]);

 

  return (
    <NavigationIndependentTree>
      <AuthContext.Provider value={{ user, setUser }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
            >
              <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
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
            </KeyboardAvoidingView>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </AuthContext.Provider>
    </NavigationIndependentTree>
  );
}
