import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SearchBar from '../components/SearchBar';
import ExhibitionListCard from '../components/ExhibitionListCard';
import { ExhibitionWithoutMuseum, getExhibitionByMuseumAPI } from '@/api';
import { useAuth } from '@/contexts/AuthContext';

const SAMPLE_DATES = ['Sun 13', 'Mon 14', 'Tue 15', 'Wed 16', 'Thu 17'];

export default function ExhibitionScreen() {
  const {axiosInstance} = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>(SAMPLE_DATES[0]);
  const [exhibitions, setExhibitions] = useState<ExhibitionWithoutMuseum[]>([]);
  const { museumId } = useLocalSearchParams<{
    museumId: string;
  }>();
  const [exhibitionStartsWith, setExhibitionStartsWith] = useState<string>('');

  useEffect(() => {
    // TODO
    const fetchExhibitions = async () => {
      const response = await getExhibitionByMuseumAPI(axiosInstance, Number(museumId))
      setExhibitions(response);
    };
    fetchExhibitions();
  }, []);


  useEffect(() => {
    if (exhibitionStartsWith !== "") {
      const fetchExhibitions = async () => {
        const response = await getExhibitionByMuseumAPI(axiosInstance, Number(museumId), exhibitionStartsWith);
        setExhibitions(response);
      };
      fetchExhibitions();
    } else {
      const fetchExhibitions = async () => {
        const response = await getExhibitionByMuseumAPI(axiosInstance, Number(museumId));
        setExhibitions(response);
      };
      fetchExhibitions();
    }
  }, [exhibitionStartsWith]);

  return (
    <LinearGradient colors={["#202020", "#252525"]} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-primary">
        <View className="flex-1 w-[95%] self-center">
            <Image
                source={require('../../assets/images/imgs/logo.png')}
                className="mt-[2%] w-full h-[6%] rounded-full"
                resizeMode="contain"
            />

          <View className="mt-4 px-4 py-6">
            <Text className="text-quaternary font-inter font-bold text-2xl ml-2 mb-4">
              Exhibitions
            </Text>
            <View className="flex-row items-center">
              <View className="flex-1">
                <SearchBar placeholder='Search by exhibition name' setValue={setExhibitionStartsWith}/>
              </View>
              <TouchableOpacity className="ml-3 p-3 rounded-lg opacity-90">
                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={24}
                  color="#FFF"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row flex-1 mt-6">
            <View className="mr-4 items-center">
              <TouchableOpacity className="mb-4">
                <Ionicons name="chevron-up" size={20} color="#FFF" />
              </TouchableOpacity>

              {SAMPLE_DATES.map((date) => (
                <TouchableOpacity
                  key={date}
                  onPress={() => setSelectedDate(date)}
                  className={`w-20 h-20 mb-2 rounded-2xl items-center justify-center ${
                    selectedDate === date ? 'bg-undecenary' : 'bg-[#2A2A2A]'
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      selectedDate === date ? 'text-black font-bold' : 'text-quaternary'
                    }`}
                  >
                    {date}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity className="mt-2">
                <Ionicons name="chevron-down" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 32 }}
            >
              {exhibitions.map((ex) => (
                <View key={ex.exhibitionId} className="mb-6">
                  <ExhibitionListCard
                    name={ex.name}
                    period={`${new Date(ex.startDate).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                      })} - ${new Date(ex.endDate).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                      })}`}
                    image={ex.photoUrl}
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
