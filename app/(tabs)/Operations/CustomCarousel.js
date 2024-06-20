import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, ImageBackground } from 'react-native';
import moment from 'moment';
import { DataContext } from "../stateManagment/ContextApi";

const CustomImageCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const { width: screenWidth } = useWindowDimensions();
  const { events } = useContext(DataContext);

  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setActiveSlide(slideIndex);
  };

  const renderItem = (item, index) => {
    const eventDate = moment(item.eventDate);
    const month = eventDate.format('MMM');
    const day = eventDate.date();

    return (
      <View style={styles.slideHolder} key={index}>
        <View style={[
          styles.slide, 
          { width: screenWidth * 0.9 }, 
          index === activeSlide ? styles.activeSlide : { marginRight: screenWidth * 0.1 }
        ]}>
          <ImageBackground source={{ uri: item.eventGraphicsURL }} style={styles.image}>
            <View style={styles.eventDate}>
              <Text style={styles.dateText}>{month}</Text>
              <Text style={styles.dayText}>{day}</Text>
            </View>
          </ImageBackground>
          <Text style={styles.title}>{item.eventName}</Text>
          <Text style={styles.location}>{item.eventLocation}</Text>
        </View>
      </View>
    );
  };

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {events.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              activeSlide === index ? styles.paginationDotActive : styles.paginationDotInactive
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingRight: screenWidth * 0.1 }}
      >
        {events.map((item, index) => renderItem(item, index))}
      </ScrollView>
      {/* {renderPagination()} */}
    </View>
  );
};

const styles = StyleSheet.create({
  slideHolder: {
    // paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    height: 200,
    backgroundColor: '#FFFAF0',
    margin: 5,
    padding: 5,
  },
  activeSlide: {
    marginRight: 0, // Set margin to 0 for the active slide
  },
  image: {
    width: "100%",
    height: '80%',
    borderRadius: 20,
  },
  eventDate: {
    margin: 10,
    width: 50,
    backgroundColor: 'gray',
    padding: 5,
    borderRadius: 7,
    display: 'flex',
  },
  dateText: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
    width: 40,
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
    width: 40,
    fontWeight: 'bold',
    justifyContent: 'center',
    marginTop: -5,
  },
  title: {
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 12,
    color: "#0C0404",
  },
  location: {
    textAlign: 'left',
    fontSize: 12,
  },
  paginationContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: 'black',
  },
  paginationDotInactive: {
    backgroundColor: 'gray',
  },
});

export default CustomImageCarousel;
