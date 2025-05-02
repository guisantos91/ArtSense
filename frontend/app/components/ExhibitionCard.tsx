import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import ImageWithPlaceholder from "./ImageWithPlaceholder";
import { Ionicons } from "@expo/vector-icons";
import { ImageSourcePropType } from "react-native";

type ExhibitionCardProps = {
  name: string;
  museum: string;
  location: string;
  image: ImageSourcePropType;
};

const ExhibitionCard = ({
  name,
  museum,
  location,
  image,
}: ExhibitionCardProps) => {
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
          <Ionicons
            name="location-sharp"
            size={12}
            color="#CFCFCF"
            className="w-3 h-3 mr-1"
          />
          <Text className="text-quaternary text-[6px] font-light">
            {location}
          </Text>
        </View>

        <TouchableOpacity
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
