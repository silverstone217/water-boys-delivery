import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import {
  useFonts,
  Nunito_900Black,
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_700Bold,
  Nunito_600SemiBold,
  Nunito_800ExtraBold,
  Nunito_500Medium,
  Nunito_200ExtraLight,
} from "@expo-google-fonts/nunito";
import { StatusBar } from "expo-status-bar";

const MainLayout = () => {
  const [fontsLoaded, error] = useFonts({
    Nunito_900Black,
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_600SemiBold,
    Nunito_800ExtraBold,
    Nunito_500Medium,
    Nunito_200ExtraLight,
  });

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <StatusBar style="dark" animated />
    </>
  );
};

export default MainLayout;
