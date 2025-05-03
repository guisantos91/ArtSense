import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SearchBar from "../components/SearchBar";
import ExhibitionListCard from "../components/ExhibitionListCard";
import { ExhibitionWithoutMuseum, getExhibitionByMuseumAPI } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import dayjs from "dayjs";

export default function ExhibitionScreen() {
  const { axiosInstance } = useAuth();
  const router = useRouter();
  const { museumId } = useLocalSearchParams<{ museumId: string }>();

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    dayjs().format("MMM")
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    dayjs().format("YYYY")
  );
  const [exhibitions, setExhibitions] = useState<ExhibitionWithoutMuseum[]>([]);
  const [exhibitionStartsWith, setExhibitionStartsWith] = useState<string>("");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [dayOffset, setDayOffset] = useState(0);

  const generateFiveDays = (offset: number) => {
    return Array.from({ length: 5 }, (_, i) =>
      dayjs()
        .add(offset + i, "day")
        .format("ddd D")
    );
  };

  const sampleDates = generateFiveDays(dayOffset);

  useEffect(() => {
    setSelectedDate(sampleDates[0]);
    setSelectedMonth(dayjs().add(dayOffset, "day").format("MMM"));
    setSelectedYear(dayjs().add(dayOffset, "day").format("YYYY"));
  }, [dayOffset]);

  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);

  const handleConfirm = (date: Date) => {
    const formattedDate = dayjs(date).format("ddd D");
    const month = dayjs(date).format("MMM");
    const year = dayjs(date).format("YYYY");
    setSelectedDate(formattedDate);
    setSelectedMonth(month);
    setSelectedYear(year);
    hideDatePicker();
  };

  useEffect(() => {
    const fetchExhibitions = async () => {
      const response = await getExhibitionByMuseumAPI(
        axiosInstance,
        Number(museumId)
      );
      setExhibitions(response);
    };
    fetchExhibitions();
  }, []);

  useEffect(() => {
    const fetchExhibitions = async () => {
      const response = await getExhibitionByMuseumAPI(
        axiosInstance,
        Number(museumId),
        exhibitionStartsWith
      );
      setExhibitions(response);
    };

    if (exhibitionStartsWith !== "") fetchExhibitions();
    else {
      getExhibitionByMuseumAPI(axiosInstance, Number(museumId)).then(
        setExhibitions
      );
    }
  }, [exhibitionStartsWith]);

  return (
    <LinearGradient colors={["#202020", "#252525"]} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-primary">
        <View className="flex-1 w-[95%] self-center">
          <Image
            source={require("../../assets/images/imgs/logo.png")}
            className="mt-[2%] w-full h-[5%] rounded-full"
            resizeMode="contain"
          />
          <View className="px-4 py-6">
            <Text className="text-quaternary font-inter font-bold text-4xl ml-2 mb-4">
              Exhibitions
            </Text>
            <View className="flex-row items-center">
              <View className="flex-1">
                <SearchBar
                  placeholder="Search by exhibition name"
                  setValue={setExhibitionStartsWith}
                />
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
              <TouchableOpacity
                className="mb-4"
                onPress={() => setDayOffset((prev) => prev - 5)}
              >
                <Ionicons name="chevron-up" size={20} color="#FFF" />
              </TouchableOpacity>

              {sampleDates.map((date) => (
                <TouchableOpacity
                  key={date}
                  onPress={() => setSelectedDate(date)}
                  className={`w-20 h-20 mb-2 rounded-2xl items-center justify-center ${
                    selectedDate === date ? "bg-undecenary" : "bg-[#2A2A2A]"
                  }`}
                >
                  <Text
                    className={`text-md ${
                      selectedDate === date
                        ? "text-black font-bold"
                        : "text-quaternary"
                    }`}
                  >
                    {date.split(" ")[0]}
                  </Text>
                  <Text
                    className={`text-2xl ${
                      selectedDate === date
                        ? "text-black font-bold"
                        : "text-quaternary"
                    }`}
                  >
                    {date.split(" ")[1]}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                className="mt-2"
                onPress={() => setDayOffset((prev) => prev + 5)}
              >
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
                    period={`${new Date(ex.startDate).toLocaleDateString(
                      "en-US",
                      {
                        day: "2-digit",
                        month: "short",
                      }
                    )} - ${new Date(ex.endDate).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                    })}`}
                    image={ex.photoUrl}
                    description={ex.description}
                    exhibitionId={ex.exhibitionId.toString()}
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
