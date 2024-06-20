import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, Image, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Video from "react-native-video";
import {
  db,
  getDoc,
  getDocs,
  addDoc,
  serverTimestamp,
  collection,
  doc,
} from "../Operations/firebaseConfig";
import { TouchableOpacity } from "react-native-gesture-handler";

const PostDetails = ({ route }) => {
  const { postId, userName, image } = route.params;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showBottomNav, setShowBottomNav] = useState(true);

  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;

  // Function to fetch post details
  const fetchPostDetails = async () => {
    try {
      const postDoc = await getDoc(doc(db, "event_posts", postId));
      if (postDoc.exists()) {
        setPost({ id: postDoc.id, ...postDoc.data() });
      } else {
        console.error("Post not found");
      }
    } catch (error) {
      console.error("Error fetching post details:", error);
    }
  };

  // Function to fetch comments for the post
  const fetchComments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, `event_posts/${postId}/comments`));
      const fetchedComments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Function to handle adding a new comment
  const handleAddComment = async () => {
    try {
      const commentData = {
        user_id: userName,
        content: newComment.trim(),
        created_at: serverTimestamp(),
        userImage: image || "loading....",
      };
      await addDoc(collection(db, `event_posts/${postId}/comments`), commentData);
      setNewComment("");
      // Refetch comments to update the view
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  useEffect(() => {
    fetchPostDetails();
    fetchComments();
  }, []);

  // Debounce function to delay execution of a function
  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  };

  // Event listener for scroll events
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  // Function to handle scroll end
  const handleScrollEnd = debounce(() => {
    Animated.timing(scrollY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setShowBottomNav(true);
  }, 1500); // Adjust debounce delay as needed

  // Function to handle scroll start
  const handleScrollStart = () => {
    setShowBottomNav(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onScrollBeginDrag={handleScrollStart}
        onScrollEndDrag={handleScrollEnd}
      >
        <View style={styles.postContainer}>
           <View style={styles.userInfo}>
            <Image source={{ uri: image }} style={styles.image_user} />
            <Text style={styles.userName}>{userName}</Text>
          </View>
        </View>
          <Text style={styles.postContent}>{post?.content}</Text>
          {post?.image_url && <Image source={{ uri: post.image_url }} style={styles.postMedia} />}
          {post?.video_url && (
            <Video
              source={{ uri: post.video_url }}
              style={styles.videoPlayer}
              controls={true}
              resizeMode="contain"
              paused={false}
            />
          )}
      

        <View style={styles.commentsContainer}>
          <Text style={styles.commentsHeading}>All Comments</Text>
          {comments.map((comment) => (
            <View key={comment.id} style={styles.commentContainer}>
              <View style={styles.flexMe}>
                <Image source={{ uri: comment.userImage }} style={styles.image_user} />
                <View>
                  <Text style={styles.commentUser}>{comment.user_id}</Text>
                  <Text style={styles.commentUser2}>
                    {new Date(comment.created_at?.toDate()).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <Text style={styles.commentContent}>{comment.content}</Text>
            </View>
          ))}
          <TextInput
            style={styles.input}
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Add a comment..."
            multiline
          />
          <TouchableOpacity onPress={handleAddComment} style={styles.postBtn}>
            <Text style={styles.btnText}>Comment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <Animated.View
          style={[
            styles.bottomNav,
            {
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [0, 100],
                    outputRange: [0, 100],
                    extrapolate: "clamp",
                  }),
                },
              ],
            },
          ]}
        >
          {/* Your bottom navigation content here */}
          <Text>Bottom Navigation Content</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flex: 1,
    padding: 10,
  },
  postContainer: {
    marginBottom: 20,
  },
  postContent: {
    fontSize: 16,
    marginTop:"-5%",
    marginBottom:10,
  },
  postMedia: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  videoPlayer: {
    width: "100%",
    height: 200,
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userName: {
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  commentsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
  },
  commentsHeading: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 10,
  },
  commentContainer: {
    marginBottom: 10,
  },
  flexMe: {
    flexDirection: "row",
    marginBottom: 5,
  },
  image_user: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginRight: 10,
  },
  commentUser: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  commentUser2: {
    fontWeight: "400",
    marginBottom: 3,
    fontSize: 11,
    color: "gray",
    marginTop: -5,
  },
  commentContent: {
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
  },
  postBtn: {
    backgroundColor: "#131314",
    borderRadius: 20,
    height: 44,
    width: "50%",
    justifyContent: "center",
    alignSelf: "center",
  },
  btnText: {
    color: "white",
    textAlign: "center",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PostDetails;
