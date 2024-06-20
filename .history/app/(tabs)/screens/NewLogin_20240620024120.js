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
import { loginStyle } from "./NewLoginStyles";
import Logo from "../../../assets/logo_w.png";

const NewLogin = () => {
  const navigation = useNavigation();

  const handleLoginPress = () => {
    navigation.navigate("Login");
  };

  const handleSignUpPress = () => {
    Linking.openURL("https://eventform-two.vercel.app/");
  };

  const renderVideo = () => {
    if (Platform.OS === "web") {
      // For web, render standard HTML video element
      return (
        <video width={750} height={500} controls>
          <source src="./Videos/video1.mp4" type="video/mp4" />
        </video>
      );
    } else {
      // For React Native, handle video playback using expo-av Video component
      return (
        <View style={loginStyle.videoBg}>
          {/* You can use expo-av's Video component here for React Native */}
          {/* Example: */}
          {/* <Video
            source={require("../../../assets/intro.mp4")} // Your video file
            style={{ width: 750, height: 500 }}
            shouldPlay
            isLooping
            resizeMode={"cover"}
          /> */}
          {/* Placeholder text for illustration */}
          <Text style={{ color: "white" }}>
            Video playback is not supported in this environment.
          </Text>
        </View>
      );
    }
  };

  return (
    <View style={loginStyle.loginHolder}>
      <ImageBackground style={loginStyle.imagebg}>
        {renderVideo()}
        <StatusBar translucent backgroundColor="transparent" />
        <Image source={Logo} style={loginStyle.avatar2} />
      </ImageBackground>
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
          <Text style={loginStyle.googleBtnText}>Sign in with Google</Text>
        </TouchableOpacity>

        <View style={loginStyle.footer}>
          <Text style={loginStyle.footer_text}>@2024 (Beta)</Text>
          <Text style={loginStyle.footer_text2}>Moxie5 Marketing Agency</Text>
        </View>
      </View>
    </View>
  );
};

export default NewLogin;
