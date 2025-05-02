import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ImageWithPlaceholder from "./ImageWithPlaceholder";
import { ImageSourcePropType } from "react-native";
import { useRouter } from "expo-router";

type ExhibitionListCardProps = {
  exhibitionId: string;
  name: string;
  period: string;
  description: string;
  image: ImageSourcePropType;
};

const ExhibitionListCard = ({
  exhibitionId,
  name,
  period,
  description,
  image,
}: ExhibitionListCardProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => {
        const url = typeof image === "string" ? image : (image as any).uri;
        router.push({
          pathname: "../screens/ExhibitionDetailScreen",
          params: {
            image: url,
            exhibitionId: exhibitionId,
            name,
            description,
          },
        });
      }}
      className="w-64 h-56 bg-decenary rounded-2xl overflow-hidden ml-3"
      activeOpacity={0.8}
    >
      <View className="self-center mt-2 w-[94%] h-[60%] rounded-2xl overflow-hidden">
        <ImageWithPlaceholder
          image={image}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      <View className="flex-1 p-2 ml-1">
        <Text
          className="text-quaternary text- font-bold"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {name}
        </Text>

        <View className="absolute bottom-1 left-3 right-2 flex-row items-center justify-between">
          <Text className="text-quaternary text-xs font-light" numberOfLines={1}>
            {period}
          </Text>

          <View className="w-14 h-7 bg-quaternary rounded-2xl items-center justify-center">
            <Text className="text-xs font-bold text-primary">Select</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ExhibitionListCard;