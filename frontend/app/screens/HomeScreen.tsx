import React from "react";
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

const HomeScreen = () => {
  const router = useRouter();

  const museums = [
    {
      id: 1,
      name: "Museum Unknown",
      location: "Rua do Jervásio",
      image: `https://thumbs.dreamstime.com/b/claraboia-no-sal%C3%A3o-principal-do-hamb%C3%BArguer-kunsthalle-museum-hamburg-alemanha-de-agosto-173807511.jpg`,
      description: "Founded in 1870, the Metropolitan Museum of Art is one of the world's largest and finest art museums. Its collection includes more than two million works of art spanning over 5,000 years of human creativity.Founded in 1870, the Metropolitan Museum of Art is one of the world's largest and finest art museums. Its collection includes more than two million works of art spanning over 5,000 years of human creativity.Founded in 1870, the Metropolitan Museum of Art is one of the world's largest and finest art museums. Its collection includes more than two million works of art spanning over 5,000 years of human creativity.",
    },
    {
      id: 2,
      name: "Museum Unknown",
      location: "Rua do Jervásio",
      image: require("../../assets/images/imgs/museum2.png"),
      description: "Founded in 1870, the Metropolitan Museum of Art is one of the world's largest and finest art museums. Its collection includes more than two million works of art spanning over 5,000 years of human creativity.Founded in 1870, the Metropolitan Museum of Art is one of the world's largest and finest art museums. Its collection includes more than two million works of art spanning over 5,000 years of human creativity.Founded in 1870, the Metropolitan Museum of Art is one of the world's largest and finest art museums. Its collection includes more than two million works of art spanning over 5,000 years of human creativity.",
    },
  ];

  const exhibitions = [
    {
      id: 1,
      name: "Exhibition Pelicano",
      museum: "Museum Unknown",
      location: "Rua do Jervásio",
      description: `Lorem Ipsum is simply dummy text of the printing and  typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer`,
      image: `https://www.vmcdn.ca/f/files/mountainviewtoday/images/mvt-care-and-wear-install.jpeg;w=960`,
    },
    {
      id: 2,
      name: "Exhibition Pelicano",
      museum: "Museum Unknown",
      location: "Rua do Jervásio",
      description: `Lorem Ipsum is simply dummy text of the printing and  typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer`,
      image: `https://www.vmcdn.ca/f/files/mountainviewtoday/images/mvt-care-and-wear-install.jpeg;w=960`,
    },
    {
      id: 3,
      name: "Exhibition Pelicano",
      museum: "Museum Unknown",
      location: "Rua do Jervásio",
      description: `Lorem Ipsum is simply dummy text of the printing and  typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer`,
      image: `https://www.vmcdn.ca/f/files/mountainviewtoday/images/mvt-care-and-wear-install.jpeg;w=960`,
    },
  ];

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
                      onPress={() => router.push("./MuseumScreenRefact")}
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
                  <SearchBar />
                </View>

                <View className="mt-[7%] flex-row justify-between items-center">
                  <Text className="ml-[2%] font-inter font-bold text-quaternary text-base">
                    Most popular Museums
                  </Text>
                </View>

                <FlatList
                  data={museums}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item, index }) => (
                    <View
                      className={`${
                        index === museums.length - 1 ? "mr-8" : "mr-0"
                      } && ${index === 0 ? "ml-2" : "ml-0"}`}
                    >
                      <MuseumCard
                        name={item.name}
                        location={item.location}
                        image={item.image}
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
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item, index }) => (
                    <View
                      className={`${
                        index === exhibitions.length - 1 ? "mr-8" : "mr-0"
                      } && ${index === 0 ? "ml-4" : "ml-0"}`}
                    >
                      <ExhibitionCard
                        name={item.name}
                        museum={item.museum}
                        location={item.location}
                        description={item.description}
                        image={typeof item.image === "string" ? { uri: item.image } : item.image}
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
