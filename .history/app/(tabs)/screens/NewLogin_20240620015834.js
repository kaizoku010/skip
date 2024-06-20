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
import React from "react";
import { loginStyle } from "./NewLoginStyles";
import Logo from "../../../assets/logo_w.png";
import { useNavigation } from "@react-navigation/native";
import { Video } from "expo-av";

const NewLogin = () => {
  const navigation = useNavigation();

  const handleLoginPress = () => {
    navigation.navigate("Login"); // Navigate to the "Login" screen
  };

  const handleSignUpPress = () => {
    // Open a web page when the "Sign Up" button is pressed
    Linking.openURL("https://eventform-two.vercel.app/");
  };

  return (
    <View style={loginStyle.loginHolder}>
      <ImageBackground
        style={loginStyle.imagebg}>
        <Video
          source={require("../../../assets/intro.mp4")} // Your video file
          style={loginStyle.videoBg}
          muted={true}
          repeat={true}
          resizeMode={"cover"}
          rate={1.2}
          shouldPlay
          isLooping
        />
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
            onPress={handleSignUpPress} // Call handleSignUpPress function on button press
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
