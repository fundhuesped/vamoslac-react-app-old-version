import React from "react";
import { Text, StyleSheet, View, Animated } from "react-native";
// import { AnimatedCircularProgress } from 'react-native-circular-progress';
// import Animation from "lottie-react-native";
// import { HTTPService } from "../../../utils/HTTPServices/index.js";
// import I18n from "../../../config/i18n/index.js";
// import store from "../../../store/index.js";

const MAX_POINTS = 100;

export default class ProgressCircle extends React.Component {
  // constructor() {
  //   super();
  //   this.state = {
  //     progress: new Animated.Value(0),
  //     currentPlaces: "",
  //     totalEstablishment: "",
  //     cityOrPlace: ""
  //     // loop: true
  //     // progress: 1
  //   };
  // }

  // componentDidMount() {
  //   this.animation.play();

  //   this.interval = setInterval(() => {
  //     let downloadStatus = HTTPService.getCurrentPage();
  //     if (this.state.currentPlaces !== downloadStatus.currentPage)
  //       this.setState({
  //         currentPlaces: downloadStatus.currentPlaces,
  //         totalEstablishment: downloadStatus.totalEstablishment,
  //         cityOrPlace: downloadStatus.cityOrPlace
  //       });
  //   }, 500);
  // }

  // _renderProgress = () => {
  //   let progress;
  //   if (this.state.cityOrPlace === "place") {
  //     if (this.state.currentPlaces !== 0)
  //       progress = (
  //         <Text style={styles.loaderText}>
  //           {this.state.totalEstablishment
  //             ? I18n.t("loader_first_fetch_download_progress", {
  //                 locale: store.getState().ui.lang,
  //                 current: this.state.currentPlaces,
  //                 total: this.state.totalEstablishment
  //               })
  //             : ""}
  //         </Text>
  //       );
  //     else
  //       progress = (
  //         <Text style={styles.loaderText}>
  //           {I18n.t("loader_first_fetch_saving_places", {
  //             locale: store.getState().ui.lang
  //           })}
  //         </Text>
  //       );
  //   } else
  //     progress = (
  //       <Text style={styles.loaderText}>
  //         {I18n.t("loader_first_fetch_saving_cities", {
  //           locale: store.getState().ui.lang
  //         })}
  //       </Text>
  //     );

  //   return progress;
  // };

  // componentWillUnmount = () => clearInterval(this.interval);

  render() {
    return <Text>Mierda</Text>
  }
}

const styles = StyleSheet.create({
  animationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF"
  },
  progressBarText: {
    backgroundColor: "transparent",
    position: "absolute",
    top: 65,
    left: 56,
    width: 90,
    textAlign: "center",
    color: "#e6334c",
    fontSize: 50,
    fontWeight: "100"
  },
  loaderText: {
    color: "#e6334c",
    fontSize: 14,
    flexWrap: "wrap",
    textAlign: "center"
  },
  loaderTitle: {
    color: "#e6334c",
    fontSize: 30,
    marginBottom: 20
  }
});
