import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import ImageWithPlaceholder from "./ImageWithPlaceholder";
import { Ionicons } from "@expo/vector-icons";
import { ImageSourcePropType } from "react-native";
import { useRouter } from "expo-router";

type ExhibitionCardProps = {
  exhibitionId: string;
  name: string;
  museum: string;
  period: string;
  description: string;
  image: ImageSourcePropType | { uri: string };
};

export default function ExhibitionCard({
  exhibitionId,
  name,
  museum,
  period,
  description,
  image,
}: ExhibitionCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="w-44 h-64 bg-decenary rounded-2xl overflow-hidden relative ml-3"
      activeOpacity={0.8}
      onPress={() => {
        const url = typeof image === 'string' ? image : (image as any).uri;
        router.push({
          pathname: "../screens/ExhibitionDetailScreen",
          params: {
            image: url,
            exhibitionId: exhibitionId,
            name,
            description,
        }});
      }}
    >
      <View className="rounded-2xl w-[94%] h-[60%] overflow-hidden self-center mt-[3%]">
        <ImageWithPlaceholder
          image={image}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      <View className="p-2 flex-1">
        <Text className="text-quaternary text-xs font-bold">{name}</Text>
        <Text className="text-quaternary text-[8px] font-normal">{museum}</Text>

        <View className="absolute bottom-3 left-2 flex-row items-center mt-[8%]">
          <Ionicons
            name="calendar-outline"
            size={12}
            color="#CFCFCF"
            className="mr-1"
          />
          <Text className="text-quaternary text-xs font-light">{period}</Text>
        </View>

        <View className="absolute right-2 bottom-2 w-7 h-7 bg-quaternary rounded-lg items-center justify-center">
          <Image
            source={require("../../assets/images/icons/next.png")}
            className="w-4 h-4"
            resizeMode="contain"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}