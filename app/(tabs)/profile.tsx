import {
  Dimensions,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useUserStore } from "../../lib/store";
import { OrdersType } from "../../types/data";
import axios from "axios";
import { PUBLIC_API_URL } from "../../utils/constants";
import { sizeText, theme } from "../../utils/theme";
import { Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { returnRole } from "../../utils/functions";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

const { height, width } = Dimensions.get("window");

const ProfileScreen = () => {
  const { user, setUser } = useUserStore();
  const [orders, setOrders] = useState<OrdersType[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const token = user && user.token;

  const logout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

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
                order.status === "pending" &&
                (order.userId === null || order.userId === undefined)
            )
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
        : [],
    [user?.id, searchText, myOrders]
  );

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

  const deliveredLiterAmount = useMemo(
    () =>
      myOrders
        .filter((odr) => odr.status === "delivered")
        .reduce((acc, itm) => acc + (itm.quantity ?? 0), 0),
    [myOrders]
  );

  const deliveredBenefitAmount = useMemo(
    () =>
      myOrders
        .filter((odr) => odr.status === "delivered")
        .reduce((acc, itm) => acc + (itm.price ?? 0), 0),
    [myOrders]
  );

  const deliveredPeopleAmount = useMemo(
    () => myOrders.filter((odr) => odr.status === "delivered").length,
    [myOrders]
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          // width: width,
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
          {/* top */}
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: 10,
            }}
          >
            {/* image */}
            {user?.image ? (
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

            {/* statistics */}
            <View
              style={{
                flexDirection: "row",
                gap: 15,
                justifyContent: "center",
                flexGrow: 1,
              }}
            >
              {/* nbr how liter delivered */}
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Text
                  style={{
                    fontSize: sizeText.small,
                    fontFamily: "Nunito_400Regular",
                    color: theme.light.text,
                  }}
                >
                  Liter
                </Text>

                <Text
                  style={{
                    fontSize: sizeText.medium,
                    fontFamily: "Nunito_600SemiBold",
                    color: theme.light.text,
                  }}
                  numberOfLines={1}
                >
                  {deliveredLiterAmount} L
                </Text>
              </View>

              {/* nbr how much benefit */}
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Text
                  style={{
                    fontSize: sizeText.small,
                    fontFamily: "Nunito_400Regular",
                    color: theme.light.text,
                  }}
                >
                  Benefit
                </Text>

                <Text
                  style={{
                    fontSize: sizeText.medium,
                    fontFamily: "Nunito_600SemiBold",
                    color: theme.light.text,
                  }}
                  numberOfLines={1}
                >
                  ${deliveredBenefitAmount}
                </Text>
              </View>

              {/* nbr how many people delivered */}
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Text
                  style={{
                    fontSize: sizeText.small,
                    fontFamily: "Nunito_400Regular",
                    color: theme.light.text,
                  }}
                >
                  Client
                </Text>

                <Text
                  style={{
                    fontSize: sizeText.medium,
                    fontFamily: "Nunito_600SemiBold",
                    color: theme.light.text,
                  }}
                  numberOfLines={1}
                >
                  {deliveredPeopleAmount}
                </Text>
              </View>
            </View>
          </View>

          {/* profile info */}
          <View style={{ width: "100%", padding: 10, gap: 10 }}>
            {/* name */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
                gap: 10,
              }}
            >
              <Text
                style={{
                  fontSize: sizeText.medium,
                  fontFamily: "Nunito_400Regular",
                  color: theme.light.text,
                  width: "25%",
                }}
              >
                Name:
              </Text>

              <Text
                style={{
                  fontSize: sizeText.medium,
                  fontFamily: "Nunito_600SemiBold",

                  color: theme.light.text,
                }}
              >
                {user?.name}
              </Text>
            </View>

            {/* email */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
                gap: 10,
              }}
            >
              <Text
                style={{
                  fontSize: sizeText.medium,
                  fontFamily: "Nunito_400Regular",
                  color: theme.light.text,
                  width: "25%",
                }}
              >
                Email:
              </Text>

              <Text
                style={{
                  fontSize: sizeText.medium,
                  fontFamily: "Nunito_600SemiBold",

                  color: theme.light.text,
                }}
              >
                {user?.email}
              </Text>
            </View>

            {/* phone */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
                gap: 10,
              }}
            >
              <Text
                style={{
                  fontSize: sizeText.medium,
                  fontFamily: "Nunito_400Regular",
                  color: theme.light.text,
                  width: "25%",
                }}
              >
                Phone:
              </Text>

              <Text
                style={{
                  fontSize: sizeText.medium,
                  fontFamily: "Nunito_600SemiBold",

                  color: theme.light.text,
                }}
              >
                {user?.tel}
              </Text>
            </View>

            {/* role */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
                gap: 10,
              }}
            >
              <Text
                style={{
                  fontSize: sizeText.medium,
                  fontFamily: "Nunito_400Regular",
                  color: theme.light.text,
                  width: "25%",
                }}
              >
                Role:
              </Text>

              <Text
                style={{
                  fontSize: sizeText.medium,
                  fontFamily: "Nunito_600SemiBold",

                  color: theme.light.text,
                }}
              >
                {returnRole(user?.role)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
                gap: 10,
              }}
            >
              <Text
                style={{
                  fontSize: sizeText.medium,
                  fontFamily: "Nunito_400Regular",
                  color: theme.light.text,
                  width: "25%",
                }}
              >
                Join:
              </Text>

              <Text
                style={{
                  fontSize: sizeText.medium,
                  fontFamily: "Nunito_600SemiBold",

                  color: theme.light.text,
                }}
              >
                {user?.createdAt &&
                  new Date(user?.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
              </Text>
            </View>
          </View>

          <View
            style={{
              gap: 10,
              marginTop: 40,
            }}
          >
            {/* link */}
            <Link href={PUBLIC_API_URL + "/profile"}>
              <View
                style={{
                  backgroundColor: theme.light.primary,
                  padding: 15,
                  borderRadius: 10,
                  width: width * 0.8,
                  alignSelf: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.5,
                  shadowRadius: 4,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Nunito_600SemiBold",
                    fontSize: sizeText.medium,
                    color: theme.dark.text,
                  }}
                >
                  Edit Profile
                </Text>
              </View>
            </Link>
            {/* button log out */}
            <TouchableOpacity
              onPress={logout}
              style={{
                backgroundColor: theme.light.danger,
                padding: 15,
                borderRadius: 10,
                width: width * 0.8,
                alignSelf: "center",
                marginTop: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 4,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Nunito_600SemiBold",
                  fontSize: sizeText.medium,
                  color: theme.dark.text,
                }}
              >
                Logout
              </Text>
            </TouchableOpacity>
          </View>

          {/* others */}
          <Text
            style={{
              fontSize: sizeText.medium,
              fontFamily: "Nunito_400Regular",
              color: theme.light.disable,
              marginTop: 40,
              width: width * 0.9,
            }}
          >
            For more information contact the administrator.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 30,
    width: width,
    alignItems: "center",
  },
});
