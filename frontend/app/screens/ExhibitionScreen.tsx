import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SearchBar from "../components/SearchBar";
import ExhibitionListCard from "../components/ExhibitionListCard";
import {
  ExhibitionWithoutMuseum,
  getExhibitionByMuseumAPI,
} from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Logo from "../components/Logo";

dayjs.extend(customParseFormat);

export default function ExhibitionScreen() {
  const { axiosInstance } = useAuth();
  const { museumId } = useLocalSearchParams<{ museumId: string }>();

  const [dayOffset, setDayOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  const [exhibitionStartsWith, setExhibitionStartsWith] = useState("");
  const [exhibitions, setExhibitions] = useState<ExhibitionWithoutMuseum[]>(
    []
  );
  const [filteredExhibitions, setFilteredExhibitions] = useState<
    ExhibitionWithoutMuseum[]
  >([]);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const sampleDates = React.useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) =>
        dayjs().add(dayOffset + i, "day").format("ddd D")
      ),
    [dayOffset]
  );

  useEffect(() => {
    ;(async () => {
      const resp = await getExhibitionByMuseumAPI(
        axiosInstance,
        Number(museumId),
        exhibitionStartsWith || undefined
      );
      const sorted = resp.sort((a, b) =>
        dayjs(a.startDate).diff(dayjs(b.startDate))
      );
      console.log(
        "Fetched & sorted exhibitions:",
        sorted.map((ex) => ({
          name: ex.name,
          start: ex.startDate,
          end: ex.endDate,
        }))
      );
      setExhibitions(sorted);
      applyDateFilter(sorted, selectedDate);
    })();
  }, [axiosInstance, museumId, exhibitionStartsWith]);

  useEffect(() => {
    console.log("Selected date changed:", selectedDate);
    applyDateFilter(exhibitions, selectedDate);
  }, [selectedDate, selectedMonth, selectedYear, exhibitions]);

  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);

  const handleConfirm = (date: Date) => {
    const d = dayjs(date);
    const label = d.format("ddd D");
    const m = d.format("MMM");
    const y = d.format("YYYY");
    console.log("Date picker confirmed:", { label, m, y });

    // compute diff from today
    const diff = d.startOf("day").diff(dayjs().startOf("day"), "day");
    // floor into 5-day blocks
    const newOffset = Math.floor(diff / 5) * 5;
    console.log("Shifting strip by offset:", newOffset);

    setDayOffset(newOffset);
    setSelectedDate(label);
    setSelectedMonth(m);
    setSelectedYear(y);
    hideDatePicker();
  };

  const applyDateFilter = (
    list: ExhibitionWithoutMuseum[],
    dateLabel: string
  ) => {
    if (!dateLabel) {
      console.log("No date selected, showing all exhibitions:", list.length);
      setFilteredExhibitions(list);
      return;
    }

    console.log("Selected date string:", dateLabel);
    console.log("Selected month:", selectedMonth);
    console.log("Selected year:", selectedYear);

    const dayNum = dateLabel.split(" ")[1];
    const selectedDayJs = dayjs(
      `${selectedYear} ${selectedMonth} ${dayNum}`,
      "YYYY MMM D"
    );
    console.log(
      "Parsed selected date:",
      selectedDayJs.isValid()
        ? selectedDayJs.format("YYYY-MM-DD")
        : "Invalid Date"
    );

    const filtered = list.filter((ex) => {
      const start = dayjs(ex.startDate);
      const end = dayjs(ex.endDate);
      console.log(
        `Exhibition: ${ex.name}, Start: ${start.format(
          "YYYY-MM-DD"
        )}, End: ${end.format("YYYY-MM-DD")}`
      );
      console.log(
        `Is ${selectedDayJs.format("YYYY-MM-DD")} after ${start.format(
          "YYYY-MM-DD"
        )}?`,
        selectedDayJs.isAfter(start, "day")
      );
      console.log(
        `Is ${selectedDayJs.format("YYYY-MM-DD")} before ${end.format(
          "YYYY-MM-DD"
        )}?`,
        selectedDayJs.isBefore(end, "day")
      );
      return (
        selectedDayJs.isSame(start, "day") ||
        selectedDayJs.isSame(end, "day") ||
        (selectedDayJs.isAfter(start, "day") &&
          selectedDayJs.isBefore(end, "day"))
      );
    });

    console.log(
      "Filtered exhibitions:",
      filtered.map((ex) => ({
        name: ex.name,
        start: ex.startDate,
        end: ex.endDate,
      }))
    );
    setFilteredExhibitions(filtered);
  };

  return (
    <LinearGradient colors={["#202020", "#252525"]} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-primary">
        <View className="flex-1 w-[95%] self-center">
          <Logo />
          <View className="mt-[4%] w-full flex-1 bg-octonary rounded-t-[72px] px-8 pb-10">
            <Text className="mt-[15%] text-quinary font-cormorant text-5xl">
              Exhibitions
            </Text>

            <View className="flex-row items-center mt-[5%]">
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

            <View className="flex-row flex-1">
              <View className="items-center self-center">
                <TouchableOpacity
                  className="mb-4"
                  onPress={() => setDayOffset((d) => d - 5)}
                >
                  <Ionicons name="chevron-up" size={20} color="#FFF" />
                </TouchableOpacity>

                {sampleDates.map((label) => (
                  <TouchableOpacity
                    key={label}
                    className={`w-20 h-20 mb-2 rounded-2xl items-center justify-center ${
                      selectedDate === label
                        ? "bg-undecenary"
                        : "bg-[#2A2A2A]"
                    }`}
                    onPress={() => {
                      if (selectedDate === label) {
                        console.log("Clearing selection");
                        setSelectedDate("");
                        setSelectedMonth("");
                        setSelectedYear("");
                      } else {
                        console.log("Tapped date label:", label);
                        setSelectedDate(label);
                      }
                    }}
                  >
                    <Text
                      className={`text-md ${
                        selectedDate === label
                          ? "text-black font-bold"
                          : "text-quaternary"
                      }`}
                    >
                      {label.split(" ")[0]}
                    </Text>
                    <Text
                      className={`text-2xl ${
                        selectedDate === label
                          ? "text-black font-bold"
                          : "text-quaternary"
                      }`}
                    >
                      {label.split(" ")[1]}
                    </Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  className="mt-2"
                  onPress={() => setDayOffset((d) => d + 5)}
                >
                  <Ionicons name="chevron-down" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>

              <FlatList
                data={filteredExhibitions}
                keyExtractor={(item) => item.exhibitionId.toString()}
                renderItem={({ item }) => (
                  <View className="mb-6">
                    <ExhibitionListCard
                      name={item.name}
                      period={`${dayjs(item.startDate).format(
                        "DD MMM"
                      )} - ${dayjs(item.endDate).format("DD MMM")}`}
                      image={item.photoUrl}
                      description={item.description}
                      exhibitionId={item.exhibitionId.toString()}
                    />
                  </View>
                )}
                contentContainerStyle={{ paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
                className="flex-1 self-center ml-4"
              />
            </View>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
