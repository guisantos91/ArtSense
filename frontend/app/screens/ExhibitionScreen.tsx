import React, { useState } from 'react';
import {
  View, Text, Image, SafeAreaView,
  ScrollView, TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SearchBar from '../components/SearchBar';
import ExhibitionCard from '../components/ExhibitionCard';

const SAMPLE_DATES = [
  'Sun 13',
  'Mon 14',
  'Tue 15',
  'Wed 16',
  'Thu 17',
];

const SAMPLE_EXHIBITIONS = [
  { id: '1', title: 'Antes assim que infelizmente', period: '11 Apr – 31 May', image: require('../../assets/images/imgs/exhibition.png') },
  { id: '2', title: 'Antes assim que infelizmente', period: '11 Apr – 31 May', image: require('../../assets/images/imgs/exhibition.png') },
  { id: '3', title: 'Antes assim que infelizmente', period: '11 Apr – 31 May', image: require('../../assets/images/imgs/exhibition.png') },
];

export default function ExhibitionScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(SAMPLE_DATES[0]);

  return (
    <LinearGradient colors={["#202020", "#252525"]} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1">
        <View className="flex-1 w-[95%] self-center">
          <Image
            source={require('../../assets/images/imgs/logo.png')}
            className="mt-[2%] w-full h-[5%] rounded-full"
            resizeMode="contain"
          />

          <Text className="mt-[4%] text-quaternary font-inter font-bold text-2xl">
            Exhibitions
          </Text>

          <View className="flex-row items-center mt-4">
            <SearchBar />
            <TouchableOpacity className="ml-3 p-2 bg-senary rounded-lg">
              <MaterialCommunityIcons name="calendar-month-outline" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity className="ml-2 p-2 bg-senary rounded-lg">
              <MaterialCommunityIcons name="pencil-outline" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View className="flex-row mt-6 flex-1">
            <View className="mr-4 items-center">
              <TouchableOpacity onPress={() => {}}>
                <Ionicons name="chevron-up" size={20} color="#FFF" />
              </TouchableOpacity>
              {SAMPLE_DATES.map((date) => (
                <TouchableOpacity
                  key={date}
                  onPress={() => setSelectedDate(date)}
                  className={`w-14 h-14 rounded-lg items-center justify-center my-2 ${
                    date === selectedDate ? 'bg-gray-200' : 'bg-senary'
                  }`}
                >
                  <Text className={`${date === selectedDate ? 'text-black font-bold' : 'text-quaternary'} text-sm`}>
                    {date}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => {}}>
                <Ionicons name="chevron-down" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
              {SAMPLE_EXHIBITIONS.map((ex) => (
                <View key={ex.id} className="mb-4">
                  <ExhibitionCard
                    name={ex.title}
                    museum="Museum Unknown"
                    location="Rua do Jervásio"
                    image={ex.image}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
