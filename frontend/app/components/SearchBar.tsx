import React from "react";
import { View, TextInput } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const SearchBar = () => {
  return (
    <View className="flex-row items-center bg-septenary rounded-xl px-5 ">
      <TextInput
        className="flex-1 text-quaternary font-inter py-3"
        placeholder="Search for museums, exhibitions..."
        placeholderTextColor="#CFCFCF"
      />
      <FontAwesome name="search" size={16} color="#CFCFCF" />
    </View>
  );
};

export default SearchBar;
