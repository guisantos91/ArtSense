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

      <View className="flex-1 p-2 ml-1 flex flex-col">
        <Text className="text-quaternary text-lg font-bold">
          {name}
        </Text>

        <View className="flex-row items-center justify-between mt-auto">
          <Text className="text-quaternary text-xs font-light">
            {period}
          </Text>

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
            className="w-14 h-7 bg-quaternary rounded-2xl items-center justify-center"
            activeOpacity={0.8}
          >
            <Text className="text-xs font-bold text-primary">Select</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ExhibitionListCard;
