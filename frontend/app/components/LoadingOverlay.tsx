import React from "react";
import { View, ActivityIndicator, Text } from "react-native";

const LoadingOverlay = () => {
  return (
    <View className="absolute inset-0 bg-black/50 justify-center items-center z-50">
      <ActivityIndicator size="large" color="#fff" />
      <Text className="text-white mt-4 text-lg font-semibold">Loading...</Text>
    </View>
  );
};

export default LoadingOverlay;
