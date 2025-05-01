import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const SignUpScreen = () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          className="flex-1 w-full"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-[95%] h-[95%] bg-primary items-center self-center">
            <Image
              source={require("../../assets/images/imgs/logo_ArtSense.png")}
              className="mt-[4%] self-center"
              style={{ width: 160, resizeMode: "contain" }}
            />

            <View className="mt-[4%] w-[98%] bg-octonary rounded-[72px] px-8 pb-10">
              <Text className="mt-[15%] w-full text-quinary font-ebgaramond text-6xl">
                Sign up
              </Text>

              <View className="mt-[7%]">
                <Text className="text-sm text-quaternary mb-[4%] ml-[4%] font-inter">
                  Name
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Name"
                  placeholderTextColor={"#CFCFCF"}
                  className="bg-septenary rounded-xl px-5 py-3 text-quaternary font-inter w-[92%] self-center"
                />
              </View>

              <View className="mt-[7%]">
                <Text className="text-sm text-quaternary mb-[4%] ml-[4%] font-inter">
                  Email address
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="example@email.com"
                  placeholderTextColor={"#CFCFCF"}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="bg-septenary rounded-xl px-5 py-3 text-quaternary font-inter w-[92%] self-center"
                />
              </View>

              <View className="mt-[7%]">
                <Text className="text-sm text-quaternary mb-[4%] ml-[4%] font-inter">
                  Create a password
                </Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="must be 6 characters or more"
                  placeholderTextColor={"#CFCFCF"}
                  secureTextEntry
                  className="bg-septenary rounded-xl px-5 py-3 text-quaternary font-inter w-[92%] self-center"
                />
              </View>

              <View className="mt-[7%]">
                <Text className="text-sm text-quaternary mb-[4%] ml-[4%] font-inter">
                  Confirm password
                </Text>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="confirm the password"
                  placeholderTextColor={"#CFCFCF"}
                  secureTextEntry
                  className="bg-septenary rounded-xl px-5 py-3 text-quaternary font-inter w-[92%] self-center"
                />
              </View>

              <TouchableOpacity
                onPress={() => router.push("./PhotoScreen")}
                className="mt-[12%] h-[42px] w-[92%] self-center bg-senary rounded-[14px] items-center justify-center"
                activeOpacity={0.8}
              >
                <Text className="text-septenary font-medium text-lg leading-5 font-inter">
                  Continue
                </Text>
              </TouchableOpacity>
            </View>

            <Text className="mt-[6%] text-center text-quaternary text-sm font-inter">
              Do you have an account?
            </Text>

            <TouchableOpacity
              onPress={() => router.push("./LoginScreen")}
              className="mt-2 w-[62%] h-12 bg-octonary rounded-[14px] items-center justify-center mb-8"
              activeOpacity={0.8}
            >
              <Text className="text-quinary text-lg leading-5 font-medium font-inter">
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default SignUpScreen;
