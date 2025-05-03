import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import SearchBar from "../components/SearchBar";
import { useRouter } from "expo-router";
import MuseumCard from "../components/MuseumCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ExhibitionCard from "../components/ExhibitionCard";
import { useAuth } from "@/contexts/AuthContext";
import { getExhibitionsAPI, getMuseumsAPI } from "@/api";
import type { Exhibition, Museum } from "@/api";

const HomeScreen = () => {
  const router = useRouter();
  const { axiosInstance, login } = useAuth();

  const [museums, setMuseums] = useState<Museum[]>([]);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [museumStartsWith, setMuseumStartsWith] = useState<string>("");

  useEffect(() => {
    const fetchMuseums = async () => {
      const response = await getMuseumsAPI(axiosInstance);
      setMuseums(response);
    };

    const fetchExhibitions = async () => {
      const response = await getExhibitionsAPI(axiosInstance);
      setExhibitions(response);
    };

    fetchMuseums();
    fetchExhibitions();
  }, []);

  useEffect(() => {
    if (museumStartsWith !== "") {
      console.log("Museum starts with: ", museumStartsWith);
      //TODO
      const fetchMuseums = async () => {
        const response = await getMuseumsAPI(axiosInstance, museumStartsWith);
        setMuseums(response);
      };

      const fetchExhibitions = async () => {
        const response = await getExhibitionsAPI(
          axiosInstance,
          museumStartsWith
        );
        setExhibitions(response);
      };

      fetchMuseums();
      fetchExhibitions();
    } else {
      const fetchMuseums = async () => {
        const response = await getMuseumsAPI(axiosInstance);
        setMuseums(response);
      };

      const fetchExhibitions = async () => {
        const response = await getExhibitionsAPI(axiosInstance);
        setExhibitions(response);
      };

      fetchMuseums();
      fetchExhibitions();
    }
  }, [museumStartsWith]);

  return (
    <LinearGradient colors={["#202020", "#252525"]} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1">
        <StatusBar backgroundColor="transparent" translucent />

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            className="flex-1 w-full"
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="w-[95%] items-center self-center">
              <Image
                source={require("../../assets/images/imgs/logo.png")}
                className="mt-[2%] w-full h-[5%] rounded-full"
                resizeMode="contain"
              />

              <View className="mt-[4%] w-full flex-1 bg-octonary rounded-t-[72px] px-8 pb-10">
                <View className="flex-row items-center justify-between">
                  <Text className="mt-[12%] w-[80%] text-quinary font-cormorant font-semibold text-5xl">
                    What are you looking for?
                  </Text>
                  <View className="bg-senary rounded-full p-2.5 mt-[12%] mr-[4%]">
                    <TouchableOpacity
                      onPress={() => router.push("./QRCodeScreen")}
                      activeOpacity={0.8}
                    >
                      <MaterialCommunityIcons
                        name="qrcode-scan"
                        size={22}
                        color="#202020"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="mt-[7%] w-full">
                  <SearchBar
                    placeholder="Search by a specific museum"
                    setValue={setMuseumStartsWith}
                  />
                </View>

                <View className="mt-[7%] flex-row justify-between items-center">
                  <Text className="ml-[2%] font-inter font-bold text-quaternary text-base">
                    Most popular Museums
                  </Text>
                </View>

                <FlatList
                  data={museums}
                  keyExtractor={(item) => item.museumId.toString()}
                  renderItem={({ item, index }) => (
                    <View
                      className={`${
                        index === museums.length - 1 ? "mr-8" : "mr-0"
                      } && ${index === 0 ? "ml-2" : "ml-0"}`}
                    >
                      <MuseumCard
                        museumId={item.museumId.toString()}
                        name={item.name}
                        location={item.location}
                        image={item.photoUrl}
                        description={item.description}
                      />
                    </View>
                  )}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mt-[4%] mb-[6%] -mx-8 pr-8"
                  contentContainerStyle={{ paddingHorizontal: 0 }}
                />

                <View className="mt-[4%] flex-row justify-between items-center">
                  <Text className="ml-[2%] font-inter font-bold text-quaternary text-base">
                    Most popular Exhibitions
                  </Text>
                </View>

                <FlatList
                  data={exhibitions}
                  keyExtractor={(item) => item.exhibitionId.toString()}
                  renderItem={({ item, index }) => (
                    <View
                      className={`${
                        index === exhibitions.length - 1 ? "mr-8" : "mr-0"
                      } && ${index === 0 ? "ml-4" : "ml-0"}`}
                    >
                      <ExhibitionCard
                        exhibitionId={item.exhibitionId.toString()}
                        name={item.name}
                        museum={item.museumName}
                        period={`${new Date(item.startDate).toLocaleDateString(
                          "en-US",
                          {
                            day: "2-digit",
                            month: "short",
                          }
                        )} - ${new Date(item.endDate).toLocaleDateString(
                          "en-US",
                          {
                            day: "2-digit",
                            month: "short",
                          }
                        )}`}
                        image={item.photoUrl}
                        description={item.description}
                      />
                    </View>
                  )}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mt-[4%] -mx-8 pr-8"
                  contentContainerStyle={{ paddingHorizontal: 0 }}
                />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HomeScreen;
