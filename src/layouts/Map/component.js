import React from "react";
import { NavigationActions } from "react-navigation";
import MapView from "react-native-maps";
import {
  Container,
  Header,
  Title,
  Button,
  Left,
  Right,
  Icon,
  Body
} from "native-base";
import {
  StyleSheet,
  Dimensions,
  View,
  ScrollView,
  Animated,
  Image,
  Text,
  TouchableOpacity,
  BackHandler
} from "react-native";
import { StyleProvider } from "native-base";
import getTheme from "../../config/styles/native-base-theme/components";
import platform from "../../config/styles/native-base-theme/variables/platform";
import PlacePreviewItem from "../../components/Dummy/PlacePreviewItem/component.js";
import SVGVamosLogo from "../../components/Dummy/SVG/VamosLogo/component.js";
import ProgressCircle from "../../components/Dummy/ProgressCircle/component.js";

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = width / 1.2;

const iconMarker = require("../../assets/images/marker.png");
const selectedIconMarker = require("../../assets/images/marker-selected.png");

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      selectedMarkerIndex: null,
      isPicked: true,
      errorMessage: null,
      region: {
        latitude: props.coords.latitude,
        longitude: props.coords.longitude,
        latitudeDelta: 0.05777554384854611,
        longitudeDelta: 0.04632476717233658
      }
    };
  }

  componentWillMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  componentWillUnmount = () => {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  };

  handleBackButtonClick = () => {
    if (typeof this.props.cleanState === "function") {
      this.props.cleanState();
    }
    this.props.navigation.goBack(null);
    return true;
  };

  componentDidMount = () => {
    // We should detect when scrolling has stopped then animate
    // We should just debounce the event listener here
    this.animation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= this.props.store.length) {
        index = this.props.store.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }
      clearTimeout(this.regionTimeout);
      this.regionTimeout = setTimeout(() => {
        if (this.index !== index) {
          this.index = index;
          let latitude = this.props.store[index].placeData.latitude,
            longitude = this.props.store[index].placeData.longitude;
          if (this.state.selectedMarkerIndex !== index && this.state.isPicked) {
            this.setState({ selectedMarkerIndex: index, isPicked: true });
            this.map.animateToRegion(
              {
                latitude,
                longitude,
                latitudeDelta: this.state.region.latitudeDelta,
                longitudeDelta: this.state.region.longitudeDelta
              },
              350
            );
          }
        }
      }, 10);
    });

    setTimeout(() => {
      this.setState({ loaded: true });
    }, 10);
  };

  _scrollToAnimatedScrollView = (e, index) => {
    this.setState({ selectedMarkerIndex: index, isPicked: true }, () => {
      let distanceToCard = (CARD_WIDTH + 20) * index;
      // alert(distanceToCard)
      this.refs.scrollRef._component.scrollTo({
        x: distanceToCard,
        animated: false
      });
    });
  };

  _goToLanding = () => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "Drawer" })]
    });
    this.props.navigation.dispatch(resetAction);
  };

  _onPressZoomIn = () => {
    region = {
      latitude: this.state.region.latitude,
      longitude: this.state.region.longitude,
      latitudeDelta: this.state.region.latitudeDelta / 10,
      longitudeDelta: this.state.region.longitudeDelta / 10
    };
    this.setState({
      region: {
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta
      }
    });
    this.map.animateToRegion(region, 100);
  };

  _onPressZoomOut = () => {
    region = {
      latitude: this.state.region.latitude,
      longitude: this.state.region.longitude,
      latitudeDelta: this.state.region.latitudeDelta * 10,
      longitudeDelta: this.state.region.longitudeDelta * 10
    };
    this.setState({
      region: {
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta
      }
    });
    this.map.animateToRegion(region, 100);
  };

  render() {
    const interpolations = this.props.store.map((marker, index) => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        (index + 1) * CARD_WIDTH
      ];
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 2.5, 1],
        extrapolate: "clamp"
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: "clamp"
      });
      return { scale, opacity };
    });

    return this.state.loaded ? (
      <StyleProvider style={getTheme(platform)}>
        <Container>
          <Header
            androidStatusBarColor="#E6642F"
            style={{ backgroundColor: "#E6642F" }}
          >
            <Left style={{ flex: 1 }}>
              <Button
                transparent
                onPress={() => {
                  if (typeof this.props.cleanState === "function") {
                    this.props.cleanState();
                  }
                  this.props.navigation.goBack();
                }}
              >
                <Icon name="ios-arrow-back" />
              </Button>
            </Left>
            <Body style={{ flex: 1, justifyContent: "flex-start" }}>
              <Button transparent onPress={this._goToLanding}>
                <SVGVamosLogo height={140} width={140} />
              </Button>
            </Body>
            <Right style={{ flex: 1 }} />
          </Header>
          <MapView
            ref={map => (this.map = map)}
            initialRegion={this.state.region}
            style={styles.container}
            // liteMode={true}
          >
            {this.props.store.map((marker, index) => {
              const scaleStyle = {
                transform: [
                  {
                    scale: interpolations[index].scale
                  }
                ]
              };
              const opacityStyle = {
                opacity: interpolations[index].opacity
              };
              let coords = {
                latitude: parseInt(marker.placeData.latitude),
                longitude: parseInt(marker.placeData.longitude)
              };
              return (
                <MapView.Marker
                  key={index}
                  coordinate={marker.placeData}
                  onPress={e => this._scrollToAnimatedScrollView(e, index)}
                  image={
                    this.state.selectedMarkerIndex === index
                      ? selectedIconMarker
                      : iconMarker
                  }
                />
              );
            })}
          </MapView>
          <Animated.ScrollView
            ref="scrollRef"
            horizontal
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      x: this.animation
                    }
                  }
                }
              ],
              { useNativeDriver: true }
            )}
            style={styles.scrollView}
            contentContainerStyle={styles.endPadding}
          >
            {this.props.store.map((marker, index) => (
              <View style={styles.card} key={index}>
                <PlacePreviewItem
                  data={marker}
                  navigation={this.props.navigation}
                  onPressItem={() => {}}
                />
              </View>
            ))}
          </Animated.ScrollView>
          <View
            style={{
              position: "absolute",
              top: 90,
              left: 20,
              backgroundColor: "rgba(0,0,0,0.3)",
              width: 30,
              alignItems: "center",
              borderRadius: 5
            }}
          >
            <TouchableOpacity
              style={styles.zoomIn}
              onPress={() => {
                this._onPressZoomIn();
              }}
            >
              <Icon name="add" style={styles.icon} size={30} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.zoomOut}
              onPress={() => {
                this._onPressZoomOut();
              }}
            >
              <Icon name="remove" style={styles.icon} size={30} />
            </TouchableOpacity>
          </View>
        </Container>
      </StyleProvider>
    ) : (
      <ProgressCircle downloading={false} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH
  },
  card: {
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    // height: CARD_HEIGHT,
    width: CARD_WIDTH
  },
  textContent: {
    flex: 1
  },
  markerImage: {
    width: width / 6,
    height: width / 6
  }
});
