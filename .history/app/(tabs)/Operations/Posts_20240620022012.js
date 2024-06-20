import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  Modal,
  Platform,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import {
  launchImageLibraryAsync,
  MediaTypeOptions,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import { Video  } from "react-native-video";
import {
  db,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  runTransaction,
  doc,
  orderBy,
  limit,
  startAfter,
  query,
  getDoc,
} from "../Operations/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";

const Posts = ({ eventId, uid, userName, image }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const scrollViewRef = useRef();
  const scrollY = useRef(new Animated.Value(0)).current;

  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [imageURI, setImageURI] = useState(null);
  const [videoURI, setVideoURI] = useState(null);
  const [comments, setComments] = useState({});
  const [lastPost, setLastPost] = useState(null);
  const [likes, setLikes] = useState({});
  const [author, setAuthor] = useState();
  const [attendeeList, setAttendeeList] = useState();
  const [allEvents, setAllEvents] = useState();
  const [isMediaSelected, setIsMediaSelected] = useState(false);

  const fetchPosts = async () => {
    try {
      let querySnapshot;
      if (!posts.length) {
        querySnapshot = await getDocs(
          query(collection(db, "event_posts"), orderBy("created_at", "desc"), limit(10))
        );
      } else {
        querySnapshot = await getDocs(
          query(
            collection(db, "event_posts"),
            orderBy("created_at", "desc"),
            startAfter(posts[posts.length - 1].created_at),
            limit(10)
          )
        );
      }
      const fetchedPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const newComments = {};
      await Promise.all(
        posts.map(async (post) => {
          const querySnapshot = await getDocs(collection(db, `event_posts/${post.id}/comments`));
          const fetchedComments = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          newComments[post.id] = fetchedComments;
        })
      );
      setComments(newComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleSelectImage = async () => {
    const { status } = await requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageURI(result.assets[0].uri);
      setVideoURI(null); // Clear video URI if image is selected
      setIsMediaSelected(true); // Show the floating frame
    }
  };

  const handleSelectVideo = async () => {
    const { status } = await requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Videos,
    });

    if (!result.canceled) {
      setVideoURI(result.assets[0].uri);
      setImageURI(null); // Clear image URI if video is selected
      setIsMediaSelected(true); // Show the floating frame
    }
  };

  const handlePost = async () => {
    try {
      const postData = {
        event_id: eventId,
        user_id: uid,
        content: newPostContent.trim(),
        likes_count: 0,
        created_at: serverTimestamp(),
        userImage: image
      };

      if (imageURI) {
        postData.image_url = imageURI;
      }

      if (videoURI) {
        postData.video_url = videoURI;
      }

      const postRef = await addDoc(collection(db, "event_posts"), postData);
      setNewPostContent("");
      setImageURI(null);
      setVideoURI(null);
      setIsMediaSelected(false); // Hide the floating frame

      const newPostSnapshot = await getDoc(postRef);
      const newPost = { id: newPostSnapshot.id, ...newPostSnapshot.data() };
      setPosts((prevPosts) => [newPost, ...prevPosts]);

      fetchComments(postRef.id);
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const postRef = doc(db, "event_posts", postId);
      await runTransaction(db, async (transaction) => {
        const postDoc = await transaction.get(postRef);
        if (!postDoc.exists()) {
          throw new Error("Post does not exist!");
        }
        const newLikesCount = (postDoc.data().likes_count || 0) + 1;
        transaction.update(postRef, { likes_count: newLikesCount });
        setLikes({ ...likes, [postId]: newLikesCount });
      });
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const navigateToPostDetails = (postId) => {
    navigation.navigate("PostDetails", { postId, uid, userName, image });
  };

  useEffect(() => {
    if (isFocused) {
      fetchPosts();
    }

    const getStoredList = async () => {
      const storeList = await AsyncStorage.getItem("attendeesList");
      const allEs = await AsyncStorage.getItem("allEvents");
      setAttendeeList(JSON.parse(storeList));
      setAllEvents(allEs);
    };

    getStoredList();
  }, [isFocused]);

  useEffect(() => {
    posts.forEach((post) => {
      fetchComments(post.id);
    });
  }, [posts]);

  const getUserName = (userId) => {
    const result = attendeeList?.find((attendee) => attendee.uid === userId);
    return result ? { name: result.name, image: result.image } : { name: "loading user...", image: null };
  };

  const renderVideo = (uri) => {
    if (Platform.OS === "web") {
      return (
        <video
          src={uri}
          style={styles.videoPlayer}
          controls
        />
      );
    } else {
      return (
        <VideoComponent
          source={{ uri }}
          style={styles.videoPlayer}
          controls
          resizeMode="contain"
          paused={false}
        />
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.postsHolder}>
        <View style={styles.inputContainer}>
          <View style={styles.fbstyle}>
            <View style={styles.postFeild}>
              <TextInput
                style={styles.input}
                value={newPostContent}
                onChangeText={setNewPostContent}
                placeholder="Create a post here..."
                multiline
              />
              <TouchableOpacity onPress={handlePost} style={styles.postBtn}>
                <Text style={styles.btnText}>Share</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={handleSelectImage} style={styles.actionButton}>
                <Ionicons style={styles.bell} name={"camera"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSelectVideo} style={styles.actionButton}>
                <Text style={styles.buttonText}>video</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {posts.length === 0 ? (
          <Text style={styles.noPostsText}>Start by adding a post!</Text>
        ) : (
          posts.map((post) => (
            <TouchableOpacity key={post.id} onPress={() => navigateToPostDetails(post.id)}>
              <View style={styles.postContainer}>
                <View style={styles.postHeader}>
                  <View style={styles.userInfo}>
                    <Image source={{ uri: getUserName(post.user_id).image }} style={styles.image_user} />
                    <View>
                      <Text style={styles.userName}>{getUserName(post.user_id).name}</Text>
                      <Text style={styles.dates}>{post.created_at && new Date(post.created_at.seconds * 1000).toLocaleDateString()}</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.userPost}>{post.content}</Text>
                {post.image_url && <Image source={{ uri: post.image_url }} style={styles.postMedia} />}
                {post.video_url && renderVideo(post.video_url)}

                <View style={styles.interactionContainer}>
                  <TouchableOpacity onPress={() => handleLike(post.id)}>
                    <View style={styles.flexMe}>
                      <Text style={styles.userLike}>{likes[post.id] || post.likes_count}</Text>
                      <Ionicons style={styles.icon} name="thumbs-up-outline" />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigateToPostDetails(post.id)}>
                    <View style={styles.flexMe}>
                      <Text style={styles.commentButton}>{comments[post.id] ? comments[post.id].length : 0}</Text>
                      <Ionicons style={styles.icon} name="chatbox-outline" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Modal for Media Preview and Caption Input */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isMediaSelected}
        onRequestClose={() => {
          setIsMediaSelected(false);
        }}
      >
        <View style={styles.overlay} />
        <View style={styles.modalView}>
          <TouchableOpacity onPress={() => setIsMediaSelected(false)} style={styles.closeButton}>
            {/* <Text style={styles.closeButtonText}>✖</Text> */}
            <Ionicons style={styles.closeButtonText} name={"notifications"} />

          </TouchableOpacity>
          {imageURI && <Image source={{ uri: imageURI }} style={styles.previewMedia} />}
          {videoURI && renderVideo(videoURI)}
          <TextInput
            style={styles.captionInput}
            value={newPostContent}
            onChangeText={setNewPostContent}
            placeholder="write a description..."
            multiline
          />
          <TouchableOpacity onPress={handlePost} style={styles.floatingPostBtn}>
            <Text style={styles.btnText}>Post</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  flexMe: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    textAlign: "center",
    alignSelf: "center",
    alignItems: "center",
  },
  image_user: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginRight: 10,
  },
  userInfo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#0C0404",
  },
  userPost: {
    fontSize: 12,
    marginBottom: -4,
    marginTop: -4,
    textAlign: "justify",
    color: "#666362",
  },
  dates: {
    fontSize: 9,
    color: "gray",
  },
  icon: {
    alignContent: "center",
    textAlign: "center",
    alignSelf: "center",
    alignItems: "center",
    marginLeft: 3,
  },
  commentButton: {
    fontSize: 10,
    marginLeft: 5,
  },
  userLike: {
    fontSize: 11,
  },
  postsHolder: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "column",
    marginHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    alignItems: "center",
    width: "80%",
    alignSelf: "center",
    // marginBottom: 5,
    borderRadius: 10,
    marginRight: 5,
    height: 52,
    fontSize: 11,
    justifyContent:"center"

  },
  actionButtons: {
    flexDirection: "row",
    marginBottom: 0,
    gap: 10,
  },
  
  actionButton: {
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 10,
  },
  postContainer: {
    borderWidth: 2,
    borderColor: "lightgray",
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 2,
    borderRadius: 10,
    backgroundColor: "#eeeeee",
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    backgroundColor: "#eeeeee",
  },
  postMedia: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  videoPlayer: {
    width: "100%",
    height: 200,
    marginBottom: 5,
  },
  interactionContainer: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  fbstyle: {
    backgroundColor: "#eeeeee",
    padding: 12,
    borderRadius: 20,
  },
  postFeild: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  postBtn: {
    backgroundColor: "#131314",
    borderRadius: 10,
    height: "90%",
    width: "20%",
    justifyContent: "center",
    alignSelf: "center",
  },
  btnText: {
    color: "white",
    textAlign: "center",
  },
  noPostsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,

    fontWeight: "300",
    color: "#c7c7c7",
    marginBottom:20
  },
  previewMedia: {
    width: "100%",
    borderRadius: 10,
    height: 200,
    marginTop: 10,
    marginBottom: 10,
  },
  floatingFrame: {
    position: "absolute",
    top: "0%",
    left: "10%",
    right: "10%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 3, // Ensure close button is above the modal content
  },
  closeButtonText: {
    fontSize: 18,
    color: "red",
  },
  captionInput: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    width:"85%",
    marginBottom: 10,
    borderRadius: 5,
  },
  floatingPostBtn: {
    backgroundColor: "#131314",
    borderRadius: 20,
    height: 44,
    width: 200,
    justifyContent: "center",
    alignSelf: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 4, 0.85)", // Adjust opacity as needed
    zIndex: 1,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 2, // Ensure modal content is above the overlay
  },
});

export default Posts;
