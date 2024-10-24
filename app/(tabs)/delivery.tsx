import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useUserStore } from "../../lib/store";
import * as Haptics from "expo-haptics";
import Icon from "react-native-vector-icons/Ionicons";
import { OrdersType } from "../../types/data";
import axios from "axios";
import { PUBLIC_API_URL } from "../../utils/constants";
import { TextInput } from "react-native";
import { sizeText, theme } from "../../utils/theme";
import { router } from "expo-router";
import Animated, { FadeInRight } from "react-native-reanimated";

const StatusData = [
  {
    id: 1,
    value: "",
    label: "All",
  },
  {
    id: 2,
    value: "processing",
    label: "Processing",
  },
  {
    id: 3,
    value: "delivered",
    label: "delivered",
  },
];

const { height, width } = Dimensions.get("window");

const MyDeliveryScreen = () => {
  const { user, setUser } = useUserStore();
  const [orders, setOrders] = useState<OrdersType[]>([]);
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
          const orderData =
            data.length > 0
              ? data.filter((order) => order.userId === user.id)
              : [];
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

  const myOrders = useMemo(
    () =>
      orders.length > 0 ? orders.filter((odr) => odr.userId === user?.id) : [],
    [orders, user?.id]
  );

  const filteredNewOrder = useMemo(
    () =>
      myOrders.length > 0
        ? myOrders
            .filter(
              (order) =>
                order.clientAddress
                  .toLowerCase()
                  .includes(searchText.toLowerCase()) ||
                order.orderId
                  .toLowerCase()
                  .includes(searchText.toLowerCase()) ||
                order.clientName
                  .toLowerCase()
                  .includes(searchText.toLowerCase())
            )
            .filter((order) => {
              if (status == "") return true;
              return order.status === status;
            })
        : [],
    [user?.id, searchText, myOrders, status]
  );

  // if (isLoading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" color={theme.light.primary} />
  //     </View>
  //   );
  // }

  const reFetchDataAgain = async () => {
    setIsLoading(true);
    const getData = async () => {
      if (token) {
        try {
          const result = await fetchData(token);
          const data = result.orders as OrdersType[];
          const orderData =
            data.length > 0 ? data.filter((odr) => odr.userId === user.id) : [];
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          width: width,
          paddingBottom: 20,
          paddingTop: Platform.OS === "android" ? 50 : 0,
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
          {/* text */}
          <Text
            style={{
              fontSize: sizeText.extraLarge,
              fontFamily: "Nunito_700Bold",
              color: theme.light.text,

              padding: 10,
            }}
          >
            My Delivery
          </Text>

          {/* search input */}
          <View style={styles.groupInput}>
            <Icon name="search" size={24} color="gray" />
            <TextInput
              placeholder="Search by address or ID..."
              style={{
                flex: 1,
                height: "100%",
              }}
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* status filter */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 10,
              gap: 10,
            }}
          >
            {StatusData.map((stat) => (
              <Pressable
                key={stat.id}
                style={{
                  backgroundColor:
                    stat.value === status
                      ? theme.light.primary
                      : theme.light.disable,
                  padding: 10,
                  borderRadius: 5,
                  borderWidth: stat.value === status ? 2 : 0,
                  borderColor: theme.light.primary,
                  marginHorizontal: 5,
                }}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setStatus(stat.value);
                }}
              >
                <Text
                  style={{
                    fontSize: sizeText.small,
                    fontFamily: "Nunito_600SemiBold",
                    color:
                      stat.value === status
                        ? theme.light.text
                        : theme.light.text,
                  }}
                >
                  {stat.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* orders */}
        {
          !isLoading && (
            <FlatList
              data={filteredNewOrder}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <Animated.View
                  key={item.id}
                  entering={FadeInRight.duration(100 * index)
                    .delay(600)
                    .damping(10)
                    .stiffness(100)}
                >
                  <Pressable
                    style={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                      width: "100%",
                      gap: 10,
                      backgroundColor:
                        index % 2 ? theme.light.disable : theme.light.secondary,
                      padding: 10,
                      borderRadius: 10,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 5,
                    }}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      router.push({
                        pathname: "/orders/[id]",
                        params: { id: item.orderId },
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
                      {item.orderId}
                    </Text>
                    {/* details */}
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
                          {item.quantity} liter
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
                          ${item.price}
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
                          {item.clientAddress}
                        </Text>
                      </Text>
                    </View>
                  </Pressable>
                </Animated.View>
              )}
              contentContainerStyle={{
                width: "100%",
                gap: 20,
                paddingHorizontal: 20,
                marginTop: 20,
              }}
              showsVerticalScrollIndicator={false}
              horizontal={false}
              initialNumToRender={10}
              ListEmptyComponent={() => (
                <Text
                  style={{
                    fontSize: sizeText.medium,
                    fontFamily: "Nunito_600SemiBold",
                    color: theme.light.text,
                  }}
                >
                  No orders found
                </Text>
              )}
            />
          )
          // : (
          //   <View
          //     style={{
          //       height: height * 0.5,
          //       justifyContent: "center",
          //       alignItems: "center",
          //     }}
          //   >
          //     <ActivityIndicator size="large" color={theme.light.primary} />
          //   </View>
          // )
        }
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyDeliveryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 30,
    width: width,
    alignItems: "center",
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
    width: "85%",
    gap: 5,
  },
});
