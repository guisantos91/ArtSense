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
import { useAuth } from "@/contexts/AuthContext";
import Logo from "../components/Logo";

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      console.log("Logging in with", { email, password });
      router.replace("./HomeScreen");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          className="flex-1 w-full"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-[95%] h-[95%] bg-primary items-center self-center">
            <Logo />

            <View className="flex-1 justify-center w-full">
              <View className="w-full bg-octonary rounded-[72px] px-10 py-14">
                <Text className="text-quinary font-ebgaramond text-6xl mb-8">
                  Login
                </Text>

                <View className="mb-6">
                  <Text className="text-sm text-quaternary mb-2 font-inter">
                    Email address
                  </Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="email"
                    placeholderTextColor="#CFCFCF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="bg-septenary rounded-xl px-5 py-3 text-quaternary font-inter"
                  />
                </View>

                <View className="mb-8">
                  <Text className="text-sm text-quaternary mb-2 font-inter">
                    Password
                  </Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="password"
                    placeholderTextColor="#CFCFCF"
                    secureTextEntry
                    className="bg-septenary rounded-xl px-5 py-3 text-quaternary font-inter"
                  />
                </View>

                <TouchableOpacity
                  onPress={handleLogin}
                  className="bg-senary rounded-[14px] items-center justify-center py-3"
                  activeOpacity={0.8}
                >
                  <Text className="text-septenary font-medium text-lg">
                    Continue
                  </Text>
                </TouchableOpacity>
              </View>

              <Text className="mt-6 text-center text-quaternary text-sm font-inter">
                Don’t have an account?
              </Text>
              <TouchableOpacity
                onPress={() => router.push("./SignUpScreen")}
                className="mt-2 w-[62%] h-12 bg-octonary rounded-[14px] items-center justify-center self-center"
                activeOpacity={0.8}
              >
                <Text className="text-quinary text-lg font-medium">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
