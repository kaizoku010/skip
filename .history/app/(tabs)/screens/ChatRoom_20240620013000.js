import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ImageBackground, Image, ActivityIndicator } from 'react-native';
import { doc, db, onSnapshot, updateDoc, arrayUnion } from '../Operations/firebaseConfig'; // Ensure you import from your config file
import moment from 'moment'; // Assuming you have moment set up properly
import Icon from 'react-native-vector-icons/Ionicons';
import ic_placeHolder from "../../../assets/receiver_profile_2.png";

const ProfileImage = ({ source }) => (
  <Image source={source ? { uri: source } : ic_placeHolder} style={styles.profilePhoto} />
);

const ProfileImage2 = ({ source }) => (
  <Image style={styles.profilePhoto} source={source ? { uri: source } : ic_placeHolder} />
);

const ChatRoom = ({ route, navigation }) => {
  const { roomID, user, image } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef();

  useEffect(() => {
    navigation.setOptions({ title: user.name });
  }, [navigation, user]);

  useEffect(() => {
    const roomRef = doc(db, 'chatRooms', roomID);
    const unsubscribe = onSnapshot(roomRef, (docSnapshot) => {
      const data = docSnapshot.data();
      if (data && data.messages) {
        setMessages(data.messages);
        setLoading(false); // Set loading to false after messages are loaded
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100); // Delay for smooth scrolling
      }
    });

    return () => {
      unsubscribe();
    };
  }, [roomID]);

  const sendMessage = async () => {
    if (messageInput.trim() === '') {
      return;
    }

    try {
      const roomRef = doc(db, 'chatRooms', roomID);
      const newMessage = {
        content: messageInput,
        sender: user.uid,
        timestamp: new Date(),
        image: user.image || ic_placeHolder
      };
      setMessageInput('');
      await updateDoc(roomRef, {
        messages: arrayUnion(newMessage)
      });
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100); // Delay for smooth scrolling
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/chat_bg.png")}
        style={styles.imagebg}
      >
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.messagesContainer}
            ref={scrollViewRef}
            onContentSizeChange={() => setTimeout(() => {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100)} // Delay for smooth scrolling
          >
            {messages.map((message, index) => (
              <View key={index} style={message.sender === user.uid ? styles.sentMessageContainer : styles.receivedMessageContainer}>
                {message.sender !== user.uid && <ProfileImage source={message.image} />}
                <View style={message.sender === user.uid ? styles.sentMessageItem : styles.receivedMessageItem}>
                  <Text style={styles.messageContent}>{message.content}</Text>
                  <Text style={styles.messageDate}>{moment(message.timestamp.toDate()).format('lll')}</Text>
                </View>
                {message.sender === user.uid && <ProfileImage2 source={image} />}
              </View>
            ))}
          </ScrollView>
        )}
      </ImageBackground>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageInput}
          onChangeText={setMessageInput}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Icon name="arrow-up" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageDate: {
    color: "gray",
    fontSize: 10
  },
  container: {
    flex: 1,
    padding: 10,
  },
  messagesContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  sentMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  receivedMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  sentMessageItem: {
    padding: 10,
    backgroundColor: '#DCF8C5',
    alignSelf: 'flex-end',
    borderRadius: 10,
    maxWidth: '80%',
    marginLeft: 10,
  },
  receivedMessageItem: {
    padding: 10,
    backgroundColor: '#d9dbde',
    alignSelf: 'flex-start',
    borderRadius: 10,
    maxWidth: '80%',
    marginRight: 10,
  },
  messageContent: {
    fontSize: 14,
    color: '#000',
  },
  sendButton: {
    backgroundColor: 'black',
    borderRadius: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagebg: {
    flex: 1,
    height: "90%",
    width: "100%"
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
    paddingHorizontal: 10,
    marginRight: 10,
    maxHeight: 120,
    height:50
  },
  profilePhoto: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
    marginRight: 10,
  },
});

export default ChatRoom;
