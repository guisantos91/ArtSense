import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import ImageWithPlaceholder from "./ImageWithPlaceholder";
import { Ionicons } from "@expo/vector-icons";
import { ImageSourcePropType } from "react-native";
import { useRouter } from "expo-router";

type MuseumCardProps = {
  name: string;
  location: string;
  image: ImageSourcePropType;
  description: string;
};

const MuseumCard = ({ name, location, image, description }: MuseumCardProps) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      className="w-48 h-56 rounded-2xl overflow-hidden relative ml-6"
      activeOpacity={0.8}
    >
      <ImageWithPlaceholder
        image={image}
        className="w-full h-full rounded-2xl"
        resizeMode="cover"
      />
      <View className="absolute bottom-1 w-[97%] h-[26%] bg-tertiary rounded-2xl px-2.5 justify-center opacity-90 self-center">
        <View className="left-1/2 -translate-x-1/2">
          <Text className="text-xs text-quaternary font-bold">{name}</Text>
          <View className="flex-row items-center mt-2">
            <Ionicons
              name="location-sharp"
              size={12}
              color="#CFCFCF"
              className="w-3 h-3 mr-1"
            />
            <Text className="text-[8px] text-quaternary font-light">
              {location}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "../screens/MuseumDetailScreen", 
                params: {
                name,
                location,
                image: typeof image === 'string' ? image : undefined,
                description,
                }});
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-quaternary rounded-lg items-center justify-center"
            activeOpacity={0.8}
          >
            <Text className="text-xs font-bold text-primary">Visit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MuseumCard;
