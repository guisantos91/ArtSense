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
  image: ImageSourcePropType;
};

const ExhibitionCard = ({
  exhibitionId,
  name,
  museum,
  period,
  description,
  image,
}: ExhibitionCardProps) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      className="w-36 h-56 bg-decenary rounded-2xl overflow-hidden relative ml-3"
      activeOpacity={0.8}
    >
      <View className="rounded-2xl w-[94%] h-[60%] overflow-hidden self-center mt-[3%]">
        <ImageWithPlaceholder image={image} className="w-full h-full" resizeMode="cover" />
      </View>
      <View className="p-2 flex-1">
        <Text className="text-quaternary text-xs font-bold">{name}</Text>
        <Text className="text-quaternary text-[8px] font-normal">{museum}</Text>
        <View className="flex-row items-center mt-[8%]">
          <Text className="text-quaternary text-xs font-light ml-2">
            {period}
          </Text>
        </View>

        <TouchableOpacity
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
          className="absolute right-2 bottom-2 w-7 h-7 bg-quaternary rounded-lg items-center justify-center"
          activeOpacity={0.8}
        >
          <Image
            source={require("../../assets/images/icons/next.png")}
            className="w-6 h-5"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ExhibitionCard;
