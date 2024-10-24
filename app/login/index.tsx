import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { sizeText, theme } from "../../utils/theme";
import Icon from "react-native-vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { isEmptyString } from "../../utils/functions";
import { Link, Redirect, router } from "expo-router";
import axios from "axios";
import { User } from "../../types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "../../lib/store";
import { PUBLIC_API_URL } from "../../utils/constants";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";

const logo = require("../../assets/images/water-boys-logo.png");

const { height, width } = Dimensions.get("window");

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { user, setUser } = useUserStore();

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      try {
        const userJSON = await AsyncStorage.getItem("user");
        if (userJSON !== null) {
          setUser(await JSON.parse(userJSON));
        }
      } catch (error) {
        console.error("Error retrieving user", error);
      } finally {
        setIsLoading(false);
      }
    };
    // console.log("infinte");
    getUser();
    // cleanup function to remove user when component unmounts
  }, [user?.id]);

  if (user) {
    return <Redirect href={"/(tabs)"} />;
  }

  const toggleSecureTextEntry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSecureTextEntry(!isSecureTextEntry);
  };

  const handleLogin = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (isEmptyString(email) || isEmptyString(password)) {
      setErrorMessage("Please fill in all fields");
      return;
    }
    try {
      const formData = { email, password };
      const response = await axios.post(
        PUBLIC_API_URL + "/api/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.data;

      if (result.error) {
        setErrorMessage(result.message);
        console.log(result.message);
        return;
      }
      // TODO: Save token and navigate to home page
      const newUser = result.user as User;
      await AsyncStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      setSuccessMessage("Logged in successfully");

      setTimeout(() => {
        router.replace("/(tabs)");
      }, 2000);
      // router.push("/");
    } catch (error) {
      setErrorMessage("Error occurred while logging in");
      console.error(error);
    } finally {
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.container,
            {
              position: "relative",
            },
          ]}
        >
          {/* logo */}
          <Animated.View
            style={{
              width: 100,
              height: 100,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
            entering={FadeInDown.duration(300)
              .delay(500)
              .damping(10)
              .stiffness(100)}
          >
            {/* your logo here */}
            <Image
              source={logo}
              resizeMode="contain"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </Animated.View>

          {/* text welcome */}
          <Animated.Text
            style={styles.title}
            entering={FadeInDown.duration(300)
              .delay(500)
              .damping(10)
              .stiffness(100)}
          >
            Welcome Back
          </Animated.Text>
          {/* login text */}
          <Animated.Text
            style={styles.subtitle}
            entering={FadeInDown.duration(300)
              .delay(500)
              .damping(10)
              .stiffness(100)}
          >
            Login to get started
          </Animated.Text>
          {/* your login form here */}

          <View style={styles.form}>
            {/* email */}
            <Animated.View
              style={styles.groupInput}
              entering={FadeInDown.duration(300)
                .delay(500)
                .damping(10)
                .stiffness(100)}
            >
              <TextInput
                style={{
                  flex: 1,
                  height: "100%",
                }}
                placeholder="Your email address"
                placeholderTextColor={theme.light.disable}
                value={email}
                onChangeText={setEmail}
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
              />
              <Icon name="mail-outline" size={24} color={theme.light.disable} />
            </Animated.View>

            {/* password */}
            <Animated.View
              style={styles.groupInput}
              entering={FadeInDown.duration(300)
                .delay(500)
                .damping(10)
                .stiffness(100)}
            >
              <TextInput
                style={{
                  flex: 1,
                  height: "100%",
                }}
                placeholder={isSecureTextEntry ? "**********" : "Your password"}
                placeholderTextColor={theme.light.disable}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={isSecureTextEntry}
                autoCorrect={false}
                autoCapitalize="none"
              />
              <Icon
                name={isSecureTextEntry ? "eye-outline" : "eye-off-outline"}
                size={24}
                color={theme.light.disable}
                onPress={toggleSecureTextEntry}
              />
            </Animated.View>

            {/* error message */}
            {errorMessage && (
              <Text
                style={{ color: theme.light.danger, padding: 2, opacity: 0.7 }}
              >
                {errorMessage}
              </Text>
            )}
            {/* success message */}
            {successMessage && (
              <Text style={{ color: "blue", padding: 2, opacity: 0.7 }}>
                {successMessage}
              </Text>
            )}

            {/* login button */}

            <Animated.View
              entering={FadeInDown.duration(300)
                .delay(500)
                .damping(10)
                .stiffness(100)}
            >
              <TouchableOpacity
                disabled={
                  isLoading || isEmptyString(email) || isEmptyString(password)
                }
                onPress={handleLogin}
                style={{
                  width: "100%",
                  backgroundColor:
                    isLoading || isEmptyString(email) || isEmptyString(password)
                      ? theme.light.disable
                      : theme.light.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 12,
                  paddingVertical: 10,
                  height: 45,
                }}
              >
                <Text style={{ color: theme.dark.text, fontWeight: "bold" }}>
                  {isLoading ? (
                    <ActivityIndicator color={theme.dark.text} size="small" />
                  ) : (
                    "Login"
                  )}
                </Text>
              </TouchableOpacity>
            </Animated.View>
            {/* forgot password */}
            <TouchableOpacity
              style={{}}
              onPress={() => {
                // your forgot password action here
              }}
            >
              <Animated.Text
                style={{ color: theme.light.disable }}
                entering={FadeIn.duration(300)
                  .delay(500)
                  .damping(10)
                  .stiffness(100)}
              >
                Forgot Password?
              </Animated.Text>
            </TouchableOpacity>

            {/* register */}

            <Animated.View
              style={{
                width: "100%",
                marginTop: 30,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                gap: 10,
                alignSelf: "flex-end",
              }}
              entering={FadeInDown.duration(300)
                .delay(500)
                .damping(10)
                .stiffness(100)}
            >
              <Icon
                name="information-circle-outline"
                size={24}
                color={theme.light.disable}
              />
              <Text style={{ color: theme.light.disable }}>
                Don't have an account?
              </Text>
            </Animated.View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: sizeText.extraLarge,
    fontFamily: "Nunito_700Bold",
    color: theme.light.text,
  },
  subtitle: {
    fontSize: sizeText.medium,
    fontFamily: "Nunito_400Regular",
    color: theme.light.disable,
  },
  form: {
    width: width * 0.85,
    gap: 20,
    paddingVertical: 35,
  },
  groupInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 45,
    borderRadius: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: theme.light.disable,
    backgroundColor: "transparent",
    width: "100%",
    gap: 5,
  },
});

export default LoginPage;
