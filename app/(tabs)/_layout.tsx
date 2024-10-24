import { Link, Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import Icon from "react-native-vector-icons/Ionicons";
import IconFA from "react-native-vector-icons/FontAwesome6";
import { Tabs } from "expo-router";
import { useUserStore } from "../../lib/store";
import { sizeText, theme } from "../../utils/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height, width } = Dimensions.get("window");

export default function App() {
  const { user, setUser } = useUserStore();

  const logout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    return <Redirect href={"/login"} />;
  }

  const shorterName = user.name
    ? user.name.split(" ")[0]
    : user.email?.replace(/(?<=@).*/, "");

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.light.primary,
        tabBarInactiveTintColor: theme.light.disable,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconFA size={28} name="house" color={color} />
          ),
          header: () => (
            <View style={styles.header}>
              <Text
                numberOfLines={2}
                style={[
                  styles.Welcome,
                  {
                    width: "40%",
                  },
                ]}
              >
                Welcome, {shorterName}
              </Text>

              {/* image and log out */}
              <View
                style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
              >
                {/* <TouchableOpacity onPress={logout}>
              <Icon
                name="log-out-outline"
                size={25}
                color={theme.light.danger}
              />
            </TouchableOpacity> */}

                <Link href={"/profile"}>
                  {user.image ? (
                    <View
                      // onPress={logout}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        borderWidth: 1,
                        borderColor: theme.light.disable,
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        source={{ uri: user.image }}
                        alt="user profile"
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </View>
                  ) : (
                    <Icon
                      name="person-circle-outline"
                      size={60}
                      color={theme.light.disable}
                    />
                  )}
                </Link>
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="orders/index"
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => (
            <IconFA size={28} name="water" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="delivery"
        options={{
          title: "Delivery",
          tabBarIcon: ({ color }) => (
            <IconFA size={28} name="truck" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="orders/[id]/index"
        options={{
          title: "Order",
          tabBarIcon: ({ color }) => (
            <IconFA size={28} name="water" color={color} />
          ),
          headerShown: false,
          href: null,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IconFA size={28} name="user" color={color} />
          ),
          headerShown: false,
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: width,
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 20,
  },
  Welcome: {
    fontSize: sizeText.medium,
    color: theme.light.text,
    fontFamily: "Nunito_600SemiBold",
    textTransform: "capitalize",
  },
});
