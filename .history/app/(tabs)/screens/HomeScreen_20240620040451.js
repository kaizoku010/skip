import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import Carousel from "../Operations/CustomCarousel";
import Posts from "../Operations/Posts";
import { DataContext } from "../stateManagment/ContextApi";
import { collection,db,where,query, getDocs } from "../Operations/firebaseConfig";
import Menu from "../../../assets/menu_b.png"

const HomeScreen = ({ route }) => {
  const { imagePath, userName, uid } = route.params.route;
  const [eventName, setEventName] = useState();
  const [eventId, setEventId] = useState();
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const {events } = useContext(DataContext);

  const navigation = useNavigation();
  AsyncStorage.setItem("newuserId", uid);


  useEffect(() => {
    if (route.params?.pendingRequestsCount) {
      setPendingRequestsCount(route.params.pendingRequestsCount);
    }
  }, [route.params?.pendingRequestsCount]);


  useEffect(() => {
    const getStoredData = async () => {
      const value = await AsyncStorage.getItem("eventName");
      setEventName(value);
      const event_Id = await AsyncStorage.getItem("newKey");
      setEventId(event_Id);

      //get chat requests from firestore
        try {
      const passID = await AsyncStorage.getItem("passId2");
      const parsedData = JSON.parse(passID);
      const password = parsedData?.password;

      const requestsRef = collection(db, "chatRequests");
      const q = query(requestsRef, where("receiverId", "==", password), where("status", "==", "pending"));
      const querySnapshot = await getDocs(q);
      setPendingRequestsCount(querySnapshot.size);

    console.log("id pass: ", pendingRequestsCount)
    } catch (error) {
      
      console.error("Error fetching pending requests count:", error);
    }
    };
    getStoredData();
  
  });


  const openRequests = () => {
    navigation.navigate("requests", { requestData: uid });
  };

  return (
    <View style={styles.homeElement}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.header}>


      <View style={styles.userInfo}>
          <View style={styles.counts}>
               <TouchableOpacity style={styles.click}>
               <Image style={styles.userImage2} source={Menu} />

          </TouchableOpacity>
          </View>
       
        </View>

        <View style={styles.userNameMbu}>

<View style={styles.middle_sec}>
  {/* userImage */}
{/* greetings */}
          {/* <Text style={styles.attending2}>Hello, </Text> */}
          <Text style={styles.attending}>{userName}</Text>
        <Image style={styles.userImage} srcSet={imagePath} />

</View>



        </View>
     {/* notifications */}
        <View style={styles.userInfo}>
          <View style={styles.counts}>
               <TouchableOpacity style={styles.click} onPress={openRequests}>
            <Ionicons style={styles.bell} name={"notifications"} />
            <Text style={styles.badge}>{pendingRequestsCount}</Text>
          </TouchableOpacity>
          </View>
       
        </View>
      </View>

   
      <SafeAreaView style={styles.checkView}>
        <ScrollView style={styles.checkView}>
          {/* <Carousel/> */}
          <Posts
            eventId={eventId}
            uid={uid}
            image={imagePath}
            userName={userName}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  checkView: {
    // backgroundColor:"red",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  mayday: {
    marginTop: 20,
    fontWeight: "500",
    fontSize: 12,
  },

  click:{
    // backgroundColor:"green",
    flexDirection:"row",
    height:"auto"
  },
  counts:{
    display:"flex",
    flexDirection:"row",
    // backgroundColor:"blue",
    // width:200
  },
  bell: {
    fontSize: 23,
    alignSelf: "center",
    marginRight:-10,
    color:"#030933"

  },
  badge:{
  textAlign:"center",
    backgroundColor:"red",
    borderRadius:50,
    color:"white",
    padding:2,
    width:20,
    height:20,
  display:"flex",
  placecontent: "center",
    textAlign:"center",
    fontSize:13,
    alignSelf:"center",
    alignItems:"center",
  },

  listing: {
    padding: "2.5%",
    marginTop: -25,
    marginHorizontal: 10,
    marginVertical: 2,
    borderRadius: 10,
    backgroundColor: "#eeeeee",
    marginTop:0,
    marginBottom:5
  },

  homeElement: {
    display: "flex",
    height: "100%",
    marginTop: 35,
  },
  header: {
    justifyContent: "space-between",
    // backgroundColor: "green",
    alignItems: "center",
    height: "10%",
    flexDirection: "row",
    padding: "2.5%",
  },
  userInfo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

  middle_sec: {
    backgroundColor:"white",
    paddingLeft:10,
    paddingRight:10,
    paddingTop:4,
    paddingBottom:4,
    borderRadius:5,
    display:"flex",
    flexDirection:"row",
alignItems:"center",
alignContent:"center",
justifyContent:"center",
alignSelf:"center",
  },


  userImage2: {
    width: 30,
    height: 30,
    alignSelf: "center",
    marginLeft: 10,
    
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 50,
    alignSelf: "center",
    marginLeft: 10,
    
  },
  // logo: {
  //   marginLeft: "-10px",
  // },

  greetings: {
    fontSize: 25,
    marginTop:20,
    fontWeight: "800",
    marginBottom:20
  },
  greetings2: {
    fontSize: 15,
    fontWeight: "800",
    width: 288,
    marginTop: 4,
    color: "#b8a1dc",
    marginBottom: 5,
  },

  attending: {
    fontSize: 13,
    fontWeight:"bold"
  },
  attending2: {
    fontSize: 13,
    fontWeight: "600",
  },
  userNameMbu:{
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
  },
  userNameMbu2:{
    marginLeft:10
  }
});

export default HomeScreen;
