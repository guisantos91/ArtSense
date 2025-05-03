import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Logo from "../components/Logo";

const LandingScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 82 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-[95%] h-[95%] bg-primary items-center self-center">
          <Logo />

          <View className="mt-[4%] w-full min-h-[540px] bg-octonary rounded-[72px] relative overflow-hidden">
            <Image
              source={require("../../assets/images/imgs/main-image.png")}
              className="absolute bottom-0 right-0 w-[80%] h-[340px] z-0"
              resizeMode="cover"
            />

            <View className="px-8 z-10">
              <Text className="mt-[15%] w-full text-quinary font-ebgaramond text-6xl">
                Welcome!
              </Text>

              <Text className="mt-5 w-full text-quaternary font-medium text-sm leading-[18px]">
                From symbols of power to everyday life, explore how artists have
                shaped history. Uncover hidden stories and techniques with{" "}
                <Text className="text-quaternary font-extrabold">ArtSense</Text>
                .
              </Text>

              <TouchableOpacity
                onPress={() => router.push("./screens/LoginScreen")}
                className="mt-5 w-[116px] h-[36px] border border-[#f0eace2e] rounded-[14px] items-center justify-center"
              >
                <Text className="text-undecenary font-medium text-sm leading-[18px]">
                  Explore more...
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.replace("./screens/LoginScreen")}
            className="mt-[8%] w-[65%] h-12 bg-senary rounded-[14px] items-center justify-center"
            activeOpacity={0.8}
          >
            <Text className="text-septenary font-medium text-lg leading-5 font-inter">
              Let's start!
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LandingScreen;
