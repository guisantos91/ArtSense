import React from 'react';
import {
  View, Text, Image, SafeAreaView,
  ScrollView, TouchableOpacity
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";

export default function MuseumDetailScreen() {
  const router = useRouter();
  const { name, location, image, description } =
    useLocalSearchParams<{
      name: string;
      location: string;
      image?: string;
      description: string;
    }>();

  return (
    <LinearGradient colors={["#202020", "#252525"]} style={{ flex: 1 }}>
        <SafeAreaView className="flex-1">
            <View className="flex-1 w-[95%] items-center self-center">
                <ScrollView contentContainerStyle={{ padding: 6, paddingBottom: 24 }}>
                    <Image
                        source={require("../../assets/images/imgs/logo.png")}
                        className="mt-[2%] w-full h-[8%] rounded-full"
                        resizeMode="contain"
                    />
                    <View className="flex-row items-center px-4 pt-4 mt-[4%]">
                        <TouchableOpacity onPress={() => router.back()} className="p-2">
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>

                        <View className="flex-1 items-center justify-center">
                            <View className="flex-row items-center bg-septenary px-5 py-3 rounded-full">
                                <Ionicons name="location-sharp" size={20} color="#FFF" />
                                <Text className="ml-[2%] text-quaternary font-inter font-bold text-sm">
                                    {name}
                                </Text>
                            </View>
                        </View>
                        <View style={{ width: 32 }} />
                    </View>
                    
                    {image && (
                        <Image
                            source={{ uri: image }}
                            className="w-full mt-[4%] h-[68%] rounded-3xl"
                            resizeMode="cover"
                        />
                    )}

                    <Text className="mt-[8%] ml-[4%] text-quaternary font-ebgaramond font-serif text-3xl">
                        About the Museum
                    </Text>
                    <Text className="mt-4 mx-[2%] text-undecenary font-light text-inter">
                        {description}
                    </Text>

                    <TouchableOpacity
                        onPress={() => {router.push("./ExhibitionScreen")}}
                        className="mt-[12%] h-[42px] w-[92%] self-center bg-senary rounded-[14px] items-center justify-center"
                        activeOpacity={0.8}
                    >
                        <Text className="text-septenary font-inter font-semibold">
                            See Exhibitions
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeAreaView>
    </LinearGradient>
  );
}
