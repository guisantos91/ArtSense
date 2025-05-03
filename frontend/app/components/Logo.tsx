import { Image, Text, View } from "react-native";
import React from "react";

const Logo = () => {
  return (
    <View className="flex-row items-center self-center mt-[2%]">
      <Image
        source={require("../../assets/images/imgs/ArtSenseLogo.png")}
        className="h-14 w-12"
        resizeMode="contain"
      />
      <Text className="text-3xl text-senary font-playfair">
        <Text className="font-bold">Art</Text>
        <Text className="font-normal">Sense</Text>
      </Text>
    </View>
  );
};
export default Logo;
