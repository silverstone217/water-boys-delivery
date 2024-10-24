import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useGlobalSearchParams, Link } from "expo-router";
import { OrdersType } from "../../../../types/data";
import axios from "axios";
import { PUBLIC_API_URL } from "../../../../utils/constants";
import { useUserStore } from "../../../../lib/store";
import { sizeText, theme } from "../../../../utils/theme";
import * as Haptics from "expo-haptics";

const { height, width } = Dimensions.get("window");

const OrderByIDScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [order, setOrder] = useState<OrdersType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useUserStore();

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
          const orderData = data.find((o) => o.orderId === id);
          setOrder(orderData ?? null);
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    getData();
  }, [token, id]);

  if ((!id || !order) && !isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Order not found</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.light.primary} />
      </View>
    );
  }

  const takeTheOrder = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);

    if (!user || !order) {
      alert("Retry later");
      return;
    }
    try {
      const formData = { id: order.id, userId: user.id, token: user.token };
      const response = await axios.post(
        PUBLIC_API_URL + "/api/delivery/take-order",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.data;

      if (result.error) {
        Alert.alert("Error", result.message);
        console.log(result.message);
        return;
      }

      // Handle the response data
      const newOrder = result.order as OrdersType;
      setOrder(newOrder);
      Alert.alert("Success", result.message);
    } catch (error) {
      Alert.alert("Error", "Error occurred while taking the order");
      console.error(error);
    } finally {
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  const cancelTheOrder = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);

    if (!user || !order) {
      alert("Retry later");
      return;
    }
    try {
      const formData = { id: order.id, userId: user.id, token: user.token };
      const response = await axios.post(
        PUBLIC_API_URL + "/api/delivery/cancel-order",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.data;

      if (result.error) {
        Alert.alert("Error", result.message);
        console.log(result.message);
        return;
      }

      // Handle the response data
      const newOrder = result.order as OrdersType;
      setOrder(newOrder);
      Alert.alert("Success", result.message);
    } catch (error) {
      Alert.alert("Error", "Error occurred while cancelling the order");
      console.error(error);
    } finally {
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  // validate order
  const validateTheOrder = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);

    if (!user || !order) {
      alert("Retry later");
      return;
    }
    try {
      const formData = { id: order.id, userId: user.id, token: user.token };
      const response = await axios.post(
        PUBLIC_API_URL + "/api/delivery/validate-order",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.data;

      if (result.error) {
        Alert.alert("Error", result.message);
        console.log(result.message);
        return;
      }

      // Handle the response data
      const newOrder = result.order as OrdersType;
      setOrder(newOrder);
      Alert.alert("Success", result.message);
    } catch (error) {
      Alert.alert("Error", "Error occurred while validating the order");
      console.error(error);
    } finally {
      setTimeout(() => setIsLoading(false), 2000);
    }
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
      >
        <View style={styles.container}>
          <View style={{ width: "90%", gap: 2 }}>
            <Text
              style={{ fontSize: sizeText.large, fontFamily: "Nunito_700Bold" }}
            >
              Order ID: {order?.orderId}
            </Text>
          </View>

          {/* client name */}
          <View style={{ width: "90%", gap: 2 }}>
            <Text
              style={{
                fontFamily: "Nunito_700Bold",
                fontSize: sizeText.medium,
              }}
            >
              Client Name:
            </Text>
            <Text
              style={{
                fontFamily: "Nunito_400Regular",
                fontSize: sizeText.small,
              }}
            >
              {order?.clientName}
            </Text>
          </View>

          {/* client phone */}
          <View style={{ width: "90%", gap: 2 }}>
            <Text
              style={{
                fontFamily: "Nunito_700Bold",
                fontSize: sizeText.medium,
              }}
            >
              Client Phone:
            </Text>
            <Text
              style={{
                fontFamily: "Nunito_400Regular",
                fontSize: sizeText.small,
              }}
            >
              {order?.clientPhoneNumber}
            </Text>
          </View>

          {/* client address */}
          <View style={{ width: "90%", gap: 2 }}>
            <Text
              style={{
                fontFamily: "Nunito_700Bold",
                fontSize: sizeText.medium,
              }}
            >
              Client Address:
            </Text>
            <Text
              style={{
                fontFamily: "Nunito_400Regular",
                fontSize: sizeText.small,
              }}
            >
              {order?.clientAddress}
            </Text>
          </View>

          {/* client desc */}
          {order?.clientDescription && (
            <View style={{ width: "90%", gap: 2 }}>
              <Text
                style={{
                  fontFamily: "Nunito_700Bold",
                  fontSize: sizeText.medium,
                }}
              >
                Client Description:
              </Text>
              <ScrollView
                horizontal={false}
                showsVerticalScrollIndicator={false}
                style={{ width: "100%", maxHeight: 90 }}
              >
                <Text
                  style={{
                    fontFamily: "Nunito_400Regular",
                    fontSize: sizeText.small,
                  }}
                  numberOfLines={3}
                >
                  {order?.clientDescription}
                </Text>
              </ScrollView>
            </View>
          )}
          {/* status */}
          <View style={{ width: "90%", gap: 2 }}>
            <Text
              style={{
                fontFamily: "Nunito_700Bold",
                fontSize: sizeText.medium,
              }}
            >
              Status:
            </Text>
            <Text
              style={{
                fontFamily: "Nunito_400Regular",
                fontSize: sizeText.small,
                color:
                  order?.status === "delivered"
                    ? theme.light.accent
                    : order?.status === "processing"
                    ? theme.light.primary
                    : order?.status === "cancelled"
                    ? theme.light.danger
                    : theme.light.disable,
              }}
            >
              {order?.status}
            </Text>
          </View>

          {/* quantity */}
          <View style={{ width: "90%", gap: 2 }}>
            <Text
              style={{
                fontFamily: "Nunito_700Bold",
                fontSize: sizeText.medium,
              }}
            >
              Quantity:
            </Text>
            <Text
              style={{
                fontFamily: "Nunito_400Regular",
                fontSize: sizeText.small,
              }}
            >
              {order?.quantity} liter
            </Text>
          </View>

          {/* price */}
          <View style={{ width: "90%", gap: 2 }}>
            <Text
              style={{
                fontFamily: "Nunito_700Bold",
                fontSize: sizeText.medium,
              }}
            >
              Price:
            </Text>
            <Text
              style={{
                fontFamily: "Nunito_400Regular",
                fontSize: sizeText.small,
              }}
            >
              ${order?.price}
            </Text>
          </View>
        </View>

        {/* take the order */}
        {!order?.userId && order?.status === "pending" && (
          <TouchableOpacity
            style={{
              backgroundColor: theme.light.primary,
              borderRadius: 10,
              padding: 10,
              width: "90%",
              alignSelf: "center",
              marginTop: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 4,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={takeTheOrder}
          >
            <Text
              style={{
                color: theme.dark.text,
                fontSize: sizeText.medium,
                fontFamily: "Nunito_700Bold",
              }}
            >
              Take the Order
            </Text>
          </TouchableOpacity>
        )}

        {/* validate the order */}
        {user?.id === order?.userId && order?.status === "processing" && (
          <TouchableOpacity
            style={{
              backgroundColor: theme.light.warning,
              borderRadius: 10,
              padding: 10,
              width: "90%",
              alignSelf: "center",
              marginTop: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 4,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={validateTheOrder}
          >
            <Text
              style={{
                color: theme.dark.text,
                fontSize: sizeText.medium,
                fontFamily: "Nunito_700Bold",
              }}
            >
              Validate the Order
            </Text>
          </TouchableOpacity>
        )}

        {/* Cancel the order */}
        {user?.id === order?.userId && order?.status === "processing" && (
          <TouchableOpacity
            style={{
              backgroundColor: theme.light.danger,
              borderRadius: 10,
              padding: 10,
              width: "90%",
              alignSelf: "center",
              marginTop: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 4,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={cancelTheOrder}
          >
            <Text
              style={{
                color: theme.dark.text,
                fontSize: sizeText.medium,
                fontFamily: "Nunito_700Bold",
              }}
            >
              Cancel the Order
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderByIDScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    width: width,
    alignItems: "center",
  },
});
