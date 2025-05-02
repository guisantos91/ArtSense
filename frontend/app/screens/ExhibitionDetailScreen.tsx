import React from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ExhibitionDetailScreen() {
  const router = useRouter();
  const { image, name, description, exhibitionId } = useLocalSearchParams<{
    image: string;
    name: string;
    description: string;
    exhibitionId: string;
  }>();

  const handleVisitExhibition = () => {
    router.push({
      pathname: "./PhotoScreen",
      params: {
        image: image,
        name: name,
        description: description,
        exhibitionId: exhibitionId,
      }});
  };

  console.log("detail params:", { image, name, description, exhibitionId });

  return (
    <View className="flex-1 bg-primary">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground
        source={ { uri: image }}
        style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)', '#000']}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />

        <SafeAreaView className="flex-1">
          <View className="flex-row justify-between items-center px-4 mt-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-[45px] h-[45px] bg-secondary rounded-full justify-center items-center"
            >
              <Ionicons name="arrow-back" size={24} color="#CFCFCF" />
            </TouchableOpacity>
            <Image
              source={require('../../assets/images/imgs/logo.png')}
              className="w-36 h-[60px]"
              resizeMode="contain"
            />
            <View className="w-10" />
          </View>

          <View className="absolute bottom-0 left-0 right-0 p-6">
            <Text className="text-5xl mb-4 font-ebgaramond text-quinary font-extrabold text-center">
              {name || 'Exhibition'}
            </Text>
            <Text className="mt-4 mb-6 text-center font-inter text-quaternary font-light">
              {description || 'No description available'}
            </Text>

            <TouchableOpacity
              onPress={() => router.push('./QRCodeScreen')}
              className="mt-6 w-[62%] h-12 bg-senary rounded-[14px] items-center justify-center mb-8 self-center"
              activeOpacity={0.8}
            >
              <Text className="text-septenary text-lg leading-5 font-medium font-inter">
                Start visit experience
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
