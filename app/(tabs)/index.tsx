import { Link, Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import Icon from "react-native-vector-icons/Ionicons";
import { useUserStore } from "../../lib/store";
import { sizeText, theme } from "../../utils/theme";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { PUBLIC_API_URL } from "../../utils/constants";
import { OrdersType } from "../../types/data";
import Animated, {
  FadeInDown,
  FadeIn,
  FadeInLeft,
  FadeInRight,
} from "react-native-reanimated";

const truck1 = require("../../assets/images/truck1.jpg");
const truck2 = require("../../assets/images/truck2.jpg");
const truck3 = require("../../assets/images/water2.jpg");

const { height, width } = Dimensions.get("window");

export default function HomeScreen() {
  const { user, setUser } = useUserStore();
  const [orders, setOrders] = useState<OrdersType[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  const token = user && user.token;

  const fetchData = async (token: string | null | undefined) => {
    try {
      const response = await axios.get(
        `${PUBLIC_API_URL}/api/delivery/my-delivery`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle the response data
      //   console.log(response.data);
      return response.data;
    } catch (error) {
      // Handle the error
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const getData = async () => {
      if (token) {
        try {
          const result = await fetchData(token);
          const data = result.orders as OrdersType[];
          setOrders(data);
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    getData();
  }, [token, user?.id]);

  const reFetchDataAgain = async () => {
    setIsLoading(true);
    const getData = async () => {
      if (token) {
        try {
          const result = await fetchData(token);
          const data = result.orders as OrdersType[];
          setOrders(data);
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    getData();
  };

  const filteredOrderSliced = useMemo(
    () =>
      orders.length > 0
        ? orders
            .filter(
              (order) =>
                order.status === "processing" && order.userId === user?.id
            )
            .slice(0, 4)
        : [],
    [user?.id, orders]
  );

  const filteredNewOrderSliced = useMemo(
    () =>
      orders.length > 0
        ? orders
            .filter(
              (order) =>
                order.status === "pending" &&
                (order.userId === null || order.userId === undefined)
            )
            .slice(0, 4)
        : [],
    [user?.id, orders]
  );

  if (!user) {
    return <Redirect href={"/login"} />;
  }

  // if (isLoading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" color={theme.light.primary} />
  //     </View>
  //   );
  // }

  const shorterName = user.name
    ? user.name.split(" ")[0]
    : user.email?.replace(/(?<=@).*/, "");

  return (
    <ScrollView
      contentContainerStyle={{
        width: width,
        paddingBottom: 20,
      }}
      style={{}}
      showsVerticalScrollIndicator={false}
      scrollEnabled
      horizontal={false}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={() => reFetchDataAgain()}
        />
      }
    >
      <View style={styles.container}>
        <TopAdsScroller />
        {/* main content */}
        {
          !isLoading && (
            <>
              {/* current orders */}
              {filteredOrderSliced.length > 0 && (
                <View
                  style={{
                    width: "90%",
                    //   backgroundColor: "cyan",
                    gap: 15,
                  }}
                >
                  <Text
                    style={{
                      fontSize: sizeText.extraLarge,
                      fontFamily: "Nunito_500Medium",
                      color: theme.light.text,
                    }}
                  >
                    Your current orders
                  </Text>
                  <View
                    style={{
                      gap: 15,
                      width: "100%",
                    }}
                  >
                    {filteredOrderSliced.map((odr, idx) => (
                      <Animated.View
                        key={odr.id}
                        entering={FadeInRight.duration(100 * idx)
                          .delay(600)
                          .damping(10)
                          .stiffness(100)}
                      >
                        <Pressable
                          //   href={"#"}
                          key={odr.id}
                          style={{
                            flexDirection: "column",
                            alignItems: "flex-start",
                            width: "100%",
                            gap: 10,
                            backgroundColor:
                              idx % 2
                                ? theme.light.disable
                                : theme.light.secondary,
                            padding: 10,
                            borderRadius: 10,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 5,
                          }}
                          onPress={() => {
                            Haptics.impactAsync(
                              Haptics.ImpactFeedbackStyle.Light
                            );
                            router.push({
                              pathname: "/orders/[id]",
                              params: { id: odr.orderId },
                            });
                          }}
                        >
                          <Text
                            style={{
                              fontSize: sizeText.medium,
                              fontFamily: "Nunito_600SemiBold",
                              color: theme.dark.text,
                            }}
                          >
                            {odr.orderId}
                          </Text>

                          <View>
                            <Text
                              style={{
                                color: theme.dark.text,
                                fontFamily: "Nunito_400Regular",
                              }}
                            >
                              Quantity:{" "}
                              <Text
                                style={{
                                  color: theme.dark.text,
                                  fontFamily: "Nunito_600SemiBold",
                                }}
                              >
                                {odr.quantity} liter
                              </Text>
                            </Text>
                            <Text
                              style={{
                                color: theme.dark.text,
                                fontFamily: "Nunito_400Regular",
                              }}
                            >
                              Price:{" "}
                              <Text
                                style={{
                                  color: theme.dark.text,
                                  fontFamily: "Nunito_600SemiBold",
                                }}
                              >
                                ${odr.price}
                              </Text>
                            </Text>
                            <Text
                              style={{
                                color: theme.dark.text,
                                fontFamily: "Nunito_400Regular",
                              }}
                              numberOfLines={1}
                            >
                              Address:{" "}
                              <Text
                                style={{
                                  color: theme.dark.text,
                                  fontFamily: "Nunito_600SemiBold",
                                }}
                              >
                                {odr.clientAddress}
                              </Text>
                            </Text>
                          </View>
                        </Pressable>
                      </Animated.View>
                    ))}
                  </View>
                </View>
              )}

              {/* no taken orders */}
              {filteredNewOrderSliced.length > 0 && (
                <View
                  style={{
                    width: "90%",
                    //   backgroundColor: "cyan",
                    gap: 15,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: sizeText.extraLarge,
                        fontFamily: "Nunito_500Medium",
                        color: theme.light.text,
                      }}
                    >
                      New orders
                    </Text>
                    <Link href={"/orders"}>
                      <Text
                        style={{
                          color: theme.light.primary,
                          fontFamily: "Nunito_400Regular",
                          fontSize: sizeText.medium,
                        }}
                      >
                        View all
                      </Text>
                    </Link>
                  </View>
                  <View
                    style={{
                      gap: 15,
                      width: "100%",
                    }}
                  >
                    {filteredNewOrderSliced.map((odr, idx) => (
                      <Animated.View
                        key={odr.id}
                        entering={FadeInRight.duration(100 * idx)
                          .delay(600)
                          .damping(10)
                          .stiffness(100)}
                      >
                        <Pressable
                          //   href={"#"}
                          key={odr.id}
                          style={{
                            flexDirection: "column",
                            alignItems: "flex-start",
                            width: "100%",
                            gap: 10,
                            backgroundColor:
                              idx % 2
                                ? theme.light.disable
                                : theme.light.warning,
                            padding: 10,
                            borderRadius: 10,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 5,
                          }}
                          onPress={() => {
                            Haptics.impactAsync(
                              Haptics.ImpactFeedbackStyle.Light
                            );
                            router.push({
                              pathname: "/orders/[id]",
                              params: { id: odr.orderId },
                            });
                          }}
                        >
                          <Text
                            style={{
                              fontSize: sizeText.medium,
                              fontFamily: "Nunito_600SemiBold",
                              color: theme.dark.text,
                            }}
                          >
                            {odr.orderId}
                          </Text>

                          <View>
                            <Text
                              style={{
                                color: theme.dark.text,
                                fontFamily: "Nunito_400Regular",
                              }}
                            >
                              Quantity:{" "}
                              <Text
                                style={{
                                  color: theme.dark.text,
                                  fontFamily: "Nunito_600SemiBold",
                                }}
                              >
                                {odr.quantity} liter
                              </Text>
                            </Text>
                            <Text
                              style={{
                                color: theme.dark.text,
                                fontFamily: "Nunito_400Regular",
                              }}
                            >
                              Price:{" "}
                              <Text
                                style={{
                                  color: theme.dark.text,
                                  fontFamily: "Nunito_600SemiBold",
                                }}
                              >
                                ${odr.price}
                              </Text>
                            </Text>
                            <Text
                              style={{
                                color: theme.dark.text,
                                fontFamily: "Nunito_400Regular",
                              }}
                              numberOfLines={1}
                            >
                              Address:{" "}
                              <Text
                                style={{
                                  color: theme.dark.text,
                                  fontFamily: "Nunito_600SemiBold",
                                }}
                              >
                                {odr.clientAddress}
                              </Text>
                            </Text>
                          </View>
                        </Pressable>
                      </Animated.View>
                    ))}
                  </View>
                </View>
              )}
              {/* statistic */}
            </>
          )
          // : (
          //   <View
          //     style={{
          //       height: height * 0.4,
          //       justifyContent: "center",
          //       alignItems: "center",
          //     }}
          //   >
          //     <ActivityIndicator size="large" color={theme.light.primary} />
          //   </View>
          // )
        }
      </View>
      <StatusBar style="dark" animated />
    </ScrollView>
  );
}

const dataTruck = [truck1, truck2, truck3];

const TopAdsScroller = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % dataTruck.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [index]);

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        overflow: "hidden",
        width: "90%",
        height: 150,
        position: "relative",
      }}
    >
      {/* image absolute */}
      <Animated.Image
        source={dataTruck[index]}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        entering={FadeInRight.duration(400)
          .delay(500)
          .damping(10)
          .stiffness(100)}
        // exiting={FadeInLeft.duration(300).delay(500)}
        key={index}
      />
      {/* counter */}
      <View
        style={{
          position: "absolute",
          bottom: 10,
          left: 0,
          zIndex: 50,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          gap: 15,
        }}
      >
        {dataTruck.map((_, idx) => (
          <View
            key={idx}
            style={{
              width: 35,
              height: 10,
              backgroundColor:
                index === idx ? theme.light.primary : theme.light.disable,
              borderRadius: 5,
            }}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 30,
    width: width,
    alignItems: "center",
  },
});
