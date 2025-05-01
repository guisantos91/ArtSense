import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const StartScreen = () => {
  return (
    <View>
      <Text>Start Screen</Text>
      <Text>Welcome to the app!</Text>
    </View>
  );
};

export default StartScreen;
