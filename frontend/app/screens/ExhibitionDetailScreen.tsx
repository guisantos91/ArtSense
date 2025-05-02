import React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ExhibitionDetailScreen() {
  const router = useRouter();
  const { image, name, description } = useLocalSearchParams<{
    image: string;
    name: string;
    description: string;
  }>();

  console.log('detail params:', { image, name, description });

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ImageBackground
        source={{ uri: image }}
        className="flex-1"
        resizeMode="cover"
      >
        <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)', '#000']}
            locations={[0, 0.5, 1]}
            style={StyleSheet.absoluteFill}
        />

        <View className="absolute top-4 left-4 right-4 flex-row justify-between items-center px-4 h-16">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-[45px] h-[45px] bg-secondary rounded-full justify-center items-center"
          >
            <Ionicons name="arrow-back" size={24} color="#CFCFCF" />
          </TouchableOpacity>
          <Image
            source={require('../../assets/images/imgs/logo.png')}
            className="w-32 h-8"
            resizeMode="contain"
          />
          <View className="w-10" />
        </View>

        <View className="absolute bottom-0 left-0 right-0 p-6">
          <Text className="text-5xl mb-4 font-ebgaramond text-quinary font-extrabold text-center">
            {name}
          </Text>
          <Text className="mt-4 mb-6 text-center font-inter text-quaternary font-light">
            {description}
          </Text>

          <TouchableOpacity
            onPress={() => router.push('./LoginScreen')}
            className="mt-6 w-[62%] h-12 bg-senary rounded-[14px] items-center justify-center mb-8 self-center"
            activeOpacity={0.8}
          >
            <Text className="text-septenary text-lg leading-5 font-medium font-inter">
              Start visit experience
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}