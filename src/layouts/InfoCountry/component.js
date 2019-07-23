import React from "react";
import { NavigationActions } from "react-navigation";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Left,
  Right,
  Body,
  Icon
} from "native-base";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  TouchableHighlight,
  ScrollView,
  Linking,
  BackHandler
} from "react-native";
import { StyleProvider } from "native-base";
import getTheme from "../../config/styles/native-base-theme/components";
import platform from "../../config/styles/native-base-theme/variables/platform";
import SVGVamosLogo from "../../components/Dummy/SVG/VamosLogo/component.js";
import I18n from "../../config/i18n/index.js";

import { tracker } from "../../utils/analytics/index.js";

import { getGralTextandILEForCountry } from "../../utils/engines/index.js";

import { getServiceData } from "../../utils/engines/index.js";

import {
  CON,
  VIH,
  SSR,
  MAC,
  LPI,
  DC,
  TEEN
} from "../../constants/action-types";

const { width, height } = Dimensions.get("window");

export default class InfoCountry extends React.Component {
  constructor() {
    super();
    this.state = { disabledButton: false };
  }

  componentWillMount = () => {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  };

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

  _goToSearch = () => {
    this.setState({ disabledButton: true }, () =>
      setTimeout(() => {
        this._cleanState();
      }, 1000)
    );
    if (this.props.cityDepartment !== undefined) {
      this.props.navigation.navigate("SearchForGeolocation", {
        cityDepartment: this.props.cityDepartment,
        country: I18n.t(this.props.country, {
          locale: this.props.lang
        }).toUpperCase()
      });
    } else {
      this.props.navigation.navigate("SearchForGeolocation", {
        country: I18n.t(this.props.country, {
          locale: this.props.lang
        }).toUpperCase(),
        address: this.props.address
      });
    }
  };

  _cleanState = () => this.setState({ disabledButton: false });

  _renderButton = ILEService => {
    let button;
    if (this.props.service !== "LPI")
      button = (
        <Button
          bordered
          block
          style={{ borderColor: "rgba(0, 0, 0, 0)", elevation: 2, flex: 1 }}
          onPress={!this.state.disabledButton ? this._goToSearch : null}
        >
          <Text style={{ color: "#e6334c", flexWrap: "wrap" }}>
            {I18n.t("continue_to_search_label_button", {
              locale: this.props.lang
            })}
          </Text>
        </Button>
      );
    else {
      if (ILEService)
        button = (
          <Button
            bordered
            block
            style={{ borderColor: "rgba(0, 0, 0, 0)", elevation: 2, flex: 1 }}
            onPress={!this.state.disabledButton ? this._goToSearch : null}
          >
            <Text style={{ color: "#e6334c", flexWrap: "wrap" }}>
              {I18n.t("continue_to_search_label_button", {
                locale: this.props.lang
              })}
            </Text>
          </Button>
        );
      else
        button = (
          <Button
            bordered
            block
            style={{ borderColor: "rgba(0, 0, 0, 0)", elevation: 2, flex: 1 }}
            onPress={() => this.props.navigation.goBack()}
          >
            <Text style={{ color: "#e6334c", flexWrap: "wrap" }}>
              {I18n.t("make_another_search_label_button", {
                locale: this.props.lang
              })}
            </Text>
          </Button>
        );
    }

    return button;
  };

  _handleLinks = (text, index) => {
    let textComponent;
    let textString = text.split("www.");
    let url = `http://www.${textString[1]}`;
    if (textString.length === 1) {
      textString = text.split("http://");
      url = `http://${textString[1]}`;
    }

    if (textString.length === 1) {
      textComponent = <Text key={index}>{` ${textString[0]}`}</Text>;
    } else {
      textComponent = (
        <Text style={{ flexDirection: "row" }} key={index}>
          <Text>{` ${textString[0]}`}</Text>
          <Text onPress={() => this._goURL(url)} style={{ color: "#e6334c" }}>
            {textString[1]}
          </Text>
        </Text>
      );
    }

    return textComponent;
  };

  _renderCountryInfo = (text, links) => (
    <Text>
      <Text>{text}</Text>
      <Text
        style={{
          flexDirection: "row",
          flexWrap: "wrap"
        }}
      >
        {links.map((link, index) => this._handleLinks(link, index))}
      </Text>
    </Text>
  );

  _goURL = url => {
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => {});
  };

  _goToLanding = () => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "Drawer" })]
    });
    this.props.navigation.dispatch(resetAction);
  };

  _renderGralText = (service, ILECondition, text, links) => {
    let gralText = this._renderCountryInfo(text, links);

    if (service === "LPI") {
      if (!ILECondition) gralText = null;
    }

    return gralText;
  };

  _renderCountryImages = (service, ILECondition, images) => {
    const countryImages = images.map((image, index) => {
      if (service !== "LPI")
        associationImage = (
          <Image
            key={index}
            source={image}
            style={styles.associationLogo}
            resizeMode="contain"
          />
        );
      else {
        if (ILECondition)
          associationImage = (
            <Image
              key={index}
              source={image}
              style={styles.associationLogo}
              resizeMode="contain"
            />
          );
        else associationImage = null;
      }

      return associationImage;
    });

    return countryImages;
  };

  render() {
    const gralTextandILEForCountry = getGralTextandILEForCountry(
      this.props.country
    );
    tracker.trackEvent(
      "asociacion_miembro",
      I18n.t(this.props.country, { locale: this.props.lang }).toUpperCase()
    );
    return (
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
          <Content
            contentContainerStyle={{
              flex: 1,
              backgroundColor: "#FFFFFF",
              alignItems: "center"
            }}
          >
            <ScrollView
              style={{ width: "100%" }}
              contentContainerStyle={{
                alignItems: "center",
                minHeight: height - height / 8
              }}
            >
              <View style={styles.container}>
                <View style={styles.infoCountryHeader}>
                  <View style={{ marginBottom: "2.5%" }}>
                    <Text style={{ fontSize: 22, color: "#e6334c" }}>{`${I18n.t(
                      this.props.country,
                      { locale: this.props.lang }
                    ).toUpperCase()}`}</Text>
                  </View>
                  {this._renderCountryImages(
                    this.props.service,
                    gralTextandILEForCountry.ILEService,
                    gralTextandILEForCountry.asocciationImageUrl
                  )}
                </View>
                <View style={styles.infoCountryBody}>
                  {this._renderGralText(
                    this.props.service,
                    gralTextandILEForCountry.ILEService,
                    gralTextandILEForCountry.generalText,
                    gralTextandILEForCountry.generalLinks
                  )}
                  {this.props.service === "LPI" ? (
                    <View>
                      <View style={{ height: 20 }} />
                      {this._renderCountryInfo(
                        gralTextandILEForCountry.ILEText,
                        gralTextandILEForCountry.ILELinks
                      )}
                    </View>
                  ) : null}
                </View>
                <View style={styles.infoCountryFooter}>
                  {this._renderButton(gralTextandILEForCountry.ILEService)}
                </View>
              </View>
            </ScrollView>
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

const styles = StyleSheet.create({
  fontColor: { color: "#655E5E" },
  container: {
    marginTop: "5%",
    width: width / 1.2,
    flex: 1
  },
  infoCountryHeader: {
    alignItems: "center"
  },
  associationLogo: {
    width: "100%",
    height: width / 3,
    marginBottom: 10
  },
  infoCountryBody: {
    marginVertical: "5%"
  },
  infoCountryFooter: {
    marginTop: "auto",
    marginBottom: "2%",
    paddingBottom: 10
  }
});
