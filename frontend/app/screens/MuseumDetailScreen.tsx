import React from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../components/Logo";

export default function MuseumDetailScreen() {
  const router = useRouter();
  const { museumId, name, image, description } = useLocalSearchParams<{
    museumId: string;
    name: string;
    image?: string;
    description: string;
  }>();

  return (
    <LinearGradient colors={["#202020", "#252525"]} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-primary">
        <View className="flex-1 w-[95%] self-center px-4">
          <ScrollView
            contentContainerStyle={{ paddingBottom: 82 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Logo />

            <View className="flex-row items-center mt-[4%]">
              <TouchableOpacity
                onPress={() => router.back()}
                className="p-[2%]"
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={24} color="#FFF" />
              </TouchableOpacity>
              <View className="flex-1 items-center justify-center">
                <View className="flex-row items-center bg-septenary px-[5%] py-[3%] rounded-full">
                  <Ionicons name="location-sharp" size={20} color="#FFF" />
                  <Text className="ml-[2%] text-quaternary font-inter font-bold text-sm">
                    {name}
                  </Text>
                </View>
              </View>
              <View className="w-[8%]" />
            </View>
            {image && (
              <Image
                source={{ uri: image }}
                className="w-full h-80 rounded-3xl mt-4"
                resizeMode="cover"
              />
            )}

            <Text className="mt-8 text-quaternary font-ebgaramond text-3xl">
              About the Museum
            </Text>
            <Text className="mt-4 text-undecenary font-light text-inter">
              {description}
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "./ExhibitionScreen",
                  params: {
                    museumId: museumId,
                  },
                })
              }
              className="mt-12 h-10 w-[92%] self-center bg-senary rounded-[14px] items-center justify-center"
              activeOpacity={0.8}
            >
              <Text className="text-septenary font-inter font-semibold">
                See Exhibitions
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
