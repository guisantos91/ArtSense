import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const StartScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View>
        <Text>Start Screen</Text>
        <Text>Welcome to the app!</Text>
      </View>
      <TouchableOpacity
        className="bg-blue-500 p-4 rounded"
        onPress={() => {
          router.push("./screens/LoginScreen");
        }}
      >
        <Text className="text-white">Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default StartScreen;
