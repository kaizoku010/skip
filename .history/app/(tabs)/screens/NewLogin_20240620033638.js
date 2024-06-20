import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  StatusBar,
  Linking,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Video } from "expo-av";
import { loginStyle } from "./NewLoginStyles";
import Logo from "../../../assets/logo_w.png";
import BackgroundImage from "../../../assets/hero.png"; // Add your background image

const NewLogin = () => {
  const navigation = useNavigation();

  const handleLoginPress = () => {
    navigation.navigate("Login");
  };

  const handleSignUpPress = () => {
    Linking.openURL("https://eventform-two.vercel.app/");
  };

  const renderBackground = () => {
    if (Platform.OS === "web") {
      // For web, render an image background
      return (
        <ImageBackground
          source={BackgroundImage}
          style={loginStyle.background}
        />
      );
    } else {
      // For React Native, render video playback using expo-av Video component
      return (
        <Video
          source={require("../../../assets/intro.mp4")} // Your video file
          style={loginStyle.background}
          muted={true}
          repeat={true}
          resizeMode={"cover"}
          rate={1.2}
          shouldPlay
          isLooping
        />
      );
    }
  };

  return (
    <View style={loginStyle.loginHolder}>
      {renderBackground()}
      <StatusBar translucent backgroundColor="transparent" />
      <View style={loginStyle.overlay}>
        <Image source={Logo} style={loginStyle.logo} />
        <View style={loginStyle.feildHolder}>
          <View style={loginStyle.buttons}>
            <TouchableOpacity
              style={loginStyle.loginBtn}
              onPress={handleLoginPress}
            >
              <Text style={loginStyle.loginBtnText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={loginStyle.loginBtn2}
              onPress={handleSignUpPress}
            >
              <Text style={loginStyle.loginBtnText2}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          <View style={loginStyle.orContainer}>
            <View style={loginStyle.line}></View>
            <Text style={loginStyle.orText}>Or</Text>
            <View style={loginStyle.line}></View>
          </View>
          <TouchableOpacity
            style={loginStyle.googleBtn}
            onPress={() => console.log("Google Button pressed!")}
          >
            <Text style={loginStyle.googleBtnText}>Scan QRCode to signin</Text>
          </TouchableOpacity>

          <View style={loginStyle.footer}>
            <Text style={loginStyle.footer_text}>@2024 (Beta)</Text>
            <Text style={loginStyle.footer_text2}>Moxie5 Marketing Agency</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default NewLogin;
