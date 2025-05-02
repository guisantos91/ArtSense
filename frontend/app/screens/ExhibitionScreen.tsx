import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import SearchBar from '../components/SearchBar';
import ExhibitionListCard from '../components/ExhibitionListCard';
import dayjs from 'dayjs';

const SAMPLE_DATES = ['Sun 13', 'Mon 14', 'Tue 15', 'Wed 16', 'Thu 17'];
const SAMPLE_EXHIBITIONS = [
  { id: '1', title: 'Antes assim que infelizmente', period: '11 Apr – 31 May', description: `Lorem Ipsum is simply dummy text of the printing and  typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer`, image: 'https://www.vmcdn.ca/f/files/mountainviewtoday/images/mvt-care-and-wear-install.jpeg;w=960' },
  { id: '2', title: 'O amanhã e o ontem', period: '01 Jun – 20 Jul', description: `Lorem Ipsum is simply dummy text of the printing and  typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer`, image: 'https://www.vmcdn.ca/f/files/mountainviewtoday/images/mvt-care-and-wear-install.jpeg;w=960' },
  { id: '3', title: 'Fragmentos de Cor', period: '05 Aug – 30 Sep', description: `Lorem Ipsum is simply dummy text of the printing and  typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer`, image: 'https://www.vmcdn.ca/f/files/mountainviewtoday/images/mvt-care-and-wear-install.jpeg;w=960' },
];

export default function ExhibitionScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>(SAMPLE_DATES[0]);
  const [selectedMonth, setSelectedMonth] = useState<string>(dayjs().format('MMM'));
  const [selectedYear, setSelectedYear] = useState<string>(dayjs().format('YYYY')); 
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);

  const handleConfirm = (date: Date) => {
    const formattedDate = dayjs(date).format('ddd D');
    const month = dayjs(date).format('MMM');   
    const year = dayjs(date).format('YYYY');     
    setSelectedDate(formattedDate);
    setSelectedMonth(month);
    setSelectedYear(year);
    hideDatePicker();
  };

  console.log('selected date:', selectedDate, selectedMonth, selectedYear);

  return (
    <LinearGradient colors={['#202020', '#252525']} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-primary">
        <View className="flex-1 w-[95%] self-center">

          <View className="px-4 py-6">
            <Text className="text-quaternary font-inter font-bold text-4xl ml-2 mb-4">
              Exhibitions
            </Text>
            <View className="flex-row items-center">
              <View className="flex-1">
                <SearchBar />
              </View>
              <TouchableOpacity
                className="ml-3 p-3 rounded-lg opacity-90"
                onPress={showDatePicker}
              >
                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={24}
                  color="#FFF"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row flex-1 ml-6">
            <View className="mr-6 items-center">
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
                  <Text className={`text-md ${
                      selectedDate === date
                        ? 'text-black font-bold'
                        : 'text-quaternary'
                    }`}>
                    {date.split(' ')[0]}
                  </Text>
                  <Text className={`text-2xl ${
                      selectedDate === date
                        ? 'text-black font-bold'
                        : 'text-quaternary'
                    }`}>
                    {date.split(' ')[1]}
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
              {SAMPLE_EXHIBITIONS.map((ex) => (
                <View key={ex.id} className="mb-6">
                  <ExhibitionListCard
                    name={ex.title}
                    period={ex.period}
                    description={ex.description}
                    image={{ uri: ex.image }}
                  />
                </View>
              ))}
            </ScrollView>
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
