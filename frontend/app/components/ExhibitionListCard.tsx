import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import ImageWithPlaceholder from "./ImageWithPlaceholder";
import { Ionicons } from "@expo/vector-icons";
import { ImageSourcePropType } from "react-native";

type ExhibitionListCardProps = {
  name: string;
  period: string;
  image: ImageSourcePropType;
};

const ExhibitionListCard = ({
  name,
  period,
  image,
}: ExhibitionListCardProps) => {
  return (
    <TouchableOpacity
      className="w-64 h-56 bg-decenary rounded-2xl overflow-hidden relative ml-3"
      activeOpacity={0.8}
    >
      <View className="rounded-2xl w-[94%] h-[60%] overflow-hidden self-center mt-[3%]">
        <ImageWithPlaceholder image={image} className="w-full h-full" resizeMode="cover" />
      </View>
      <View className="p-2 flex-1">
        <Text className="text-quaternary text-lg font-bold mr-4 ml-2">{name}</Text>
        <View className="flex-row items-center mt-[8%]">
          <Text className="text-quaternary text-xs font-light ml-2">
            {period}
          </Text>
        </View>

        <TouchableOpacity
          className="absolute right-2 bottom-2 w-14 h-7 bg-quaternary rounded-2xl items-center justify-center"
          activeOpacity={0.8}
        >
            <Text className="text-xs font-bold text-primary">Select</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ExhibitionListCard;
