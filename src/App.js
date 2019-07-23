import React from "react";
import { Text, Image } from "react-native";
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as Icon from '@expo/vector-icons'
import { Spinner, View } from "native-base";
import App from "./root/App.js";
import SplashScreen from "react-native-splash-screen";


if(__DEV__) {
  import('./config/ReactotronConfig').then(() => console.log('Reactotron Configured'))
}

// function cacheImages(images) {
//   return images.map(image => {
//     if (typeof image === "string") {
//       return Image.prefetch(image);
//     } 
//     else {
//       return Asset.fromModule(image).downloadAsync();
//     }
//   });
// }

// function cacheFonts(fonts) {
//   return fonts.map(font => Font.loadAsync(font));
// }

export default class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      isReady: false
    };
  }

  componentDidMount() {
    SplashScreen.hide();
    this._loadAssetsAsync();
    
  }

  async _loadAssetsAsync() {
    // const imageAssets = cacheImages([
    //   require("./assets/images/vamos_logo.png")
    // ]);

    // const fontAssets = cacheFonts([
    //   { Roboto: require("../node_modules/native-base/Fonts/Roboto.ttf") },
    //   { OpenSans: require("./assets/fonts/OpenSans.ttf") },
    //   { Roboto_medium: require("../node_modules/native-base/Fonts/Roboto_medium.ttf") },
    //   { Ionicons: Icon }
    // ]);

    // await Promise.all([...imageAssets, ...fontAssets]);

    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return <Spinner />;
    }
    return <App />
  }
}

