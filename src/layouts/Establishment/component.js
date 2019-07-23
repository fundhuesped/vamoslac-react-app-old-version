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
import { StyleProvider } from "native-base";
import {
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableHighlight,
  Dimensions,
  Modal,
  NetInfo,
  Linking,
  BackHandler
} from "react-native";
import getTheme from "../../config/styles/native-base-theme/components";
import platform from "../../config/styles/native-base-theme/variables/platform";
import SVGVamosLogo from "../../components/Dummy/SVG/VamosLogo/component.js";
import SVGTwitterIcon from "../../components/Dummy/SVG/TwitterIcon/component.js";
import SVGFacebookIcon from "../../components/Dummy/SVG/FacebookIcon/component.js";
import SVGMessengerIcon from "../../components/Dummy/SVG/MessengerIcon/component.js";
import SVGWhatsappIcon from "../../components/Dummy/SVG/WhatsappIcon/component.js";
import Accordion from "react-native-collapsible/Accordion";

import I18n from "../../config/i18n/index.js";
import { URL } from "../../config/HTTP/index.js";

import { getServiceData } from "../../utils/engines/index.js";

import { CON, VIH, SSR, MAC, LPI, DC } from "../../constants/action-types";

const { width } = Dimensions.get("window");

export default class Establishment extends React.Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
      modalText: "",
      disabledButton: false
    };
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

  _renderHeader = (section, index, isActive) => {
    let serviceData,
      title = section.title.toLowerCase();
    switch (title) {
      case "condones":
        {
          serviceData = getServiceData(CON, width / 12);
        }
        break;
      case "prueba":
        {
          serviceData = getServiceData(VIH, width / 12);
        }
        break;
      case "ile":
        {
          serviceData = getServiceData(LPI, width / 12);
        }
        break;
      case "dc":
        {
          serviceData = getServiceData(DC, width / 12);
        }
        break;
      case "mac":
        {
          serviceData = getServiceData(MAC, width / 12);
        }
        break;
      case "ssr":
        {
          serviceData = getServiceData(SSR, width / 12);
        }
        break;

      default:
    }

    return (
      <View
        style={
          index + 1 === this.props.servicesAvailable.length
            ? styles.lastHeaderService
            : styles.headerService
        }
      >
        <View style={styles.headerServiceIcon}>{serviceData.svg}</View>
        <View style={styles.headerServiceTitleContainer}>
          <Text style={styles.headerServiceTitle}>{serviceData.title}</Text>
        </View>
      </View>
    );
  };

  _renderContent = (section, index, isActive) => {
    let service,
      data = this.props.establishmentData,
      title = section.title.toLowerCase();
    switch (title) {
      case "condones":
        {
          service = {
            openTime: data.placeData.horario_distrib,
            director: data.placeData.responsable_distrib,
            email: data.placeData.mail_distrib,
            web: data.placeData.web_distrib,
            phone: data.placeData.tel_distrib,
            serviceType: data.placeData.servicetype_condones
          };
        }
        break;
      case "prueba":
        {
          service = {
            openTime: data.placeData.horario_testeo,
            director: data.placeData.responsable_testeo,
            email: data.placeData.mail_testeo,
            web: data.placeData.web_testeo,
            phone: data.placeData.tel_testeo,
            infoPrueba: data.placeData.observaciones_testeo,
            serviceType: data.placeData.servicetype_prueba
          };
        }
        break;
      case "ile":
        {
          service = {
            openTime: data.placeData.horario_ile,
            director: data.placeData.responsable_ile,
            email: data.placeData.mail_ile,
            web: data.placeData.web_ile,
            phone: data.placeData.tel_ile,
            serviceType: data.placeData.servicetype_ile
          };
        }
        break;
      case "dc":
        {
          service = {
            openTime: data.placeData.horario_dc,
            director: data.placeData.responsable_dc,
            email: data.placeData.mail_dc,
            web: data.placeData.web_dc,
            phone: data.placeData.tel_dc,
            infoDC: data.placeData.comentarios_dc,
            serviceType: data.placeData.servicetype_dc
          };
        }
        break;
      case "mac":
        {
          service = {
            openTime: data.placeData.horario_mac,
            director: data.placeData.responsable_mac,
            email: data.placeData.mail_mac,
            web: data.placeData.web_mac,
            phone: data.placeData.tel_mac,
            serviceType: data.placeData.servicetype_mac
          };
        }
        break;
      case "ssr":
        {
          service = {
            openTime: data.placeData.horario_ssr,
            director: data.placeData.responsable_ssr,
            email: data.placeData.mail_ssr,
            web: data.placeData.web_ssr,
            phone: data.placeData.tel_ssr,
            serviceType: data.placeData.servicetype_ssr
          };
        }
        break;

      default:
    }

    return (
      <View style={styles.serviceAditionalInfo}>
        {service.serviceType !== "" && service.serviceType !== undefined ? (
          <View style={styles.serviceAditionalInfoItem}>
            <Icon
              name="ios-information-circle-outline"
              style={{ fontSize: 14, color: "#FFFFFF", marginRight: "2%" }}
            />
            <Text
              style={{ color: "#FFFFFF", flex: 1, flexWrap: "wrap" }}
            >{`${I18n.t("form_select_service_type_title", {
              locale: this.props.lang
            })}: ${service.serviceType}`}</Text>
          </View>
        ) : null}
        {service.openTime !== "" && service.phone !== undefined ? (
          <View style={styles.serviceAditionalInfoItem}>
            <Icon
              name="ios-clock-outline"
              style={{ fontSize: 14, color: "#FFFFFF", marginRight: "2%" }}
            />
            <Text style={{ color: "#FFFFFF", flex: 1, flexWrap: "wrap" }}>
              {service.openTime}
            </Text>
          </View>
        ) : null}
        {service.director !== "" && service.phone !== undefined ? (
          <View style={styles.serviceAditionalInfoItem}>
            <Icon
              name="md-person"
              style={{ fontSize: 14, color: "#FFFFFF", marginRight: "2%" }}
            />
            <Text style={{ color: "#FFFFFF", flex: 1, flexWrap: "wrap" }}>
              {service.director}
            </Text>
          </View>
        ) : null}
        {service.email !== "" && service.phone !== undefined ? (
          <View style={styles.serviceAditionalInfoItem}>
            <Icon
              name="md-mail"
              style={{ fontSize: 14, color: "#FFFFFF", marginRight: "2%" }}
            />
            <Text
              style={{ color: "#FFFFFF", flex: 1, flexWrap: "wrap" }}
              onPress={() => this._goURL(`mailto:${service.email}`)}
            >
              {service.email}
            </Text>
          </View>
        ) : null}
        {service.web !== "" && service.phone !== undefined ? (
          <View style={styles.serviceAditionalInfoItem}>
            <Icon
              name="globe"
              style={{ fontSize: 14, color: "#FFFFFF", marginRight: "2%" }}
            />
            <Text
              style={{ color: "#FFFFFF", flex: 1, flexWrap: "wrap" }}
              onPress={() => this._goURL(service.web)}
            >
              {service.web}
            </Text>
          </View>
        ) : null}
        {service.phone !== "" && service.phone !== undefined ? (
          <View style={styles.serviceAditionalInfoItem}>
            <Icon
              name="ios-call"
              style={{ fontSize: 14, color: "#FFFFFF", marginRight: "2%" }}
            />
            <Text
              style={{ color: "#FFFFFF", flex: 1, flexWrap: "wrap" }}
              onPress={() => this._goURL(`tel:${service.phone}`)}
            >
              {service.phone}
            </Text>
          </View>
        ) : null}
        {service.infoDC !== "" && service.infoDC !== undefined ? (
          <View style={styles.serviceAditionalInfoItem}>
            <Icon
              name="ios-information-circle-outline"
              style={{ fontSize: 14, color: "#FFFFFF", marginRight: "2%" }}
            />
            <Text style={{ color: "#FFFFFF", flex: 1, flexWrap: "wrap" }}>
              {service.infoDC}
            </Text>
          </View>
        ) : null}
        {service.infoPrueba !== "" && service.infoPrueba !== undefined ? (
          <View style={styles.serviceAditionalInfoItem}>
            <Icon
              name="ios-information-circle-outline"
              style={{ fontSize: 14, color: "#FFFFFF", marginRight: "2%" }}
            />
            <Text style={{ color: "#FFFFFF", flex: 1, flexWrap: "wrap" }}>
              {service.infoPrueba}
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  _getServicesAvailable = () => {
    let servicesAvailable = [],
      data = this.props.establishmentData.placeData;
    if (this.props.servicesAvailable.length)
      servicesAvailable = this.props.servicesAvailable;
    else {
      if (data.condones) {
        servicesAvailable.push({
          title: "condones",
          content: {
            id: "",
            name: "",
            shortname: ""
          }
        });
      }
      if (data.prueba) {
        servicesAvailable.push({
          title: "prueba",
          content: {
            id: "",
            name: "",
            shortname: ""
          }
        });
      }
      if (data.ile) {
        servicesAvailable.push({
          title: "ile",
          content: {
            id: "",
            name: "",
            shortname: ""
          }
        });
      }
      if (data.dc) {
        servicesAvailable.push({
          title: "dc",
          content: {
            id: "",
            name: "",
            shortname: ""
          }
        });
      }
      if (data.mac) {
        servicesAvailable.push({
          title: "mac",
          content: {
            id: "",
            name: "",
            shortname: ""
          }
        });
      }
      if (data.ssr) {
        servicesAvailable.push({
          title: "ssr",
          content: {
            id: "",
            name: "",
            shortname: ""
          }
        });
      }
    }

    return servicesAvailable;
  };

  _checkConection = feature => {
    this.setState({ disabledButton: true });
    NetInfo.isConnected.fetch().then(isConnected => {
      let conection = isConnected ? "online" : "offline";
      if (isConnected) {
        feature === "map"
          ? this.props.navigation.navigate("Map", {
              establishmentData: this.props.establishmentData,
              cleanState: this._cleanState
            })
          : this.props.navigation.navigate("Evaluations", {
              servicesAvailable: this.props.servicesAvailable,
              establishment: this.props.establishmentData.placeData,
              reRenderFunction: this.props.reRenderFunction,
              cleanState: this._cleanState
            });
      } else {
        feature === "map"
          ? this.setState({
              showModal: true,
              modalText: `${I18n.t("map_popup_content", {
                locale: this.props.lang
              })}`
            })
          : this.setState({
              showModal: true,
              modalText: `${I18n.t("rate_popup_content", {
                locale: this.props.lang
              })}`
            });
      }
    });
  };

  _cleanState = () => this.setState({ disabledButton: false });

  _socialShare = social => {
    let url;
    switch (social) {
      case "whatsapp": {
        url = `whatsapp://send?text=${I18n.t("social_share_text", {
          establecimiento: this.props.establishmentData.placeData
            .establecimiento,
          nombre_partido: this.props.establishmentData.placeData
            .barrio_localidad,
          locale: this.props.lang
        })}%20${URL}/share/${this.props.establishmentData.placeData.placeId}`;
        break;
      }
      case "twitter": {
        url = `https://twitter.com/intent/tweet?text=${I18n.t(
          "social_share_text",
          {
            establecimiento: this.props.establishmentData.placeData
              .establecimiento,
            nombre_partido: this.props.establishmentData.placeData
              .barrio_localidad,
            locale: this.props.lang
          }
        )}%20${URL}/share/${this.props.establishmentData.placeData.placeId}`;
        break;
      }
      case "facebook": {
        let app_id = 1964173333831483,
          link = `${URL}/share/${
            this.props.establishmentData.placeData.placeId
          }`;

        url = `https://www.facebook.com/dialog/share?app_id=${app_id}&display=popup&href=${encodeURIComponent(
          link
        )}&quote=${I18n.t("social_share_text", {
          establecimiento: this.props.establishmentData.placeData
            .establecimiento,
          nombre_partido: this.props.establishmentData.placeData
            .barrio_localidad,
          locale: this.props.lang
        })}`;
        break;
      }
      case "messenger": {
        let link = `${I18n.t("social_share_text_not_encode", {
            establecimiento: this.props.establishmentData.placeData
              .establecimiento,
            nombre_partido: this.props.establishmentData.placeData
              .barrio_localidad,
            locale: this.props.lang
          })} ${URL}/share/${this.props.establishmentData.placeData.placeId}`,
          app_id = 1964173333831483;

        url = `fb-messenger://share?link=${encodeURIComponent(
          link
        )}&app_id=${encodeURIComponent(app_id)}`;

        break;
      }

      default:
    }

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

  _getIndexOfService = () => {
    let index = 0,
      arrayServices = this._getServicesAvailable(),
      lookingFor = this.props.lookingFor;

    arrayServices.map((service, i) => {
      if (lookingFor === CON && service.title.toLowerCase() === "condones")
        index = i;
      if (lookingFor === DC && service.title.toLowerCase() === "dc") index = i;
      if (lookingFor === LPI && service.title.toLowerCase() === "ile")
        index = i;
      if (lookingFor === MAC && service.title.toLowerCase() === "mac")
        index = i;
      if (lookingFor === SSR && service.title.toLowerCase() === "ssr")
        index = i;
      if (lookingFor === VIH && service.title.toLowerCase() === "prueba")
        index = i;
    });

    return index;
  };

  _renderAverageVote = () => {
    let averageVote = this.props.averageVote,
      averageVoteComponent;
    if (averageVote !== null) {
      averageVoteComponent = (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ marginRight: "2%" }}>
            <Text
              style={{ color: "#e6334c", fontSize: 18, fontWeight: "bold" }}
            >
              {Math.round(averageVote * 10) / 10}
            </Text>
          </View>
          {Math.round(averageVote * 10) / 10 !== 1 ? (
            <Text style={{ color: "#e6334c" }}>
              {I18n.t("point_plural", { locale: this.props.lang })}
            </Text>
          ) : (
            <Text style={{ color: "#e6334c" }}>
              {I18n.t("point_singular", { locale: this.props.lang })}
            </Text>
          )}
        </View>
      );
    } else {
      if (this.props.establishmentData.placeData.rateReal)
        averageVoteComponent = (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ marginRight: "2%" }}>
              <Text
                style={{ color: "#e6334c", fontSize: 18, fontWeight: "bold" }}
              >
                {Math.round(
                  this.props.establishmentData.placeData.rateReal * 10
                ) / 10}
              </Text>
            </View>
            {Math.round(this.props.establishmentData.placeData.rateReal * 10) /
              10 !==
            1 ? (
              <Text style={{ color: "#e6334c" }}>
                {I18n.t("point_plural", { locale: this.props.lang })}
              </Text>
            ) : (
              <Text style={{ color: "#e6334c" }}>
                {I18n.t("point_singular", { locale: this.props.lang })}
              </Text>
            )}
          </View>
        );
      else
        averageVoteComponent = (
          <Text style={{ color: "#e6334c" }}>
            {I18n.t("without_evaluations", { locale: this.props.lang })}
          </Text>
        );
    }

    return averageVoteComponent;
  };

  render() {
    let data = this.props.establishmentData,
      indexService = this._getIndexOfService();
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
              contentContainerStyle={{ alignItems: "center" }}
            >
              <View style={styles.establishmentContainer}>
                <View style={styles.establishmentHeader}>
                  <View style={styles.establishmentName}>
                    <Text
                      style={[
                        styles.fontColor,
                        { fontWeight: "bold", fontSize: 16 }
                      ]}
                    >
                      {data.placeData.establecimiento}
                    </Text>
                  </View>
                  <View style={styles.establishmentAddress}>
                    <Icon
                      name="ios-pin"
                      style={{
                        fontSize: 14,
                        marginRight: "2%",
                        color: "#655E5E"
                      }}
                    />
                    {data.placeData.cruce !== "" ? (
                      <Text style={[styles.subtitle, styles.fontColor]}>
                        {I18n.t("direcion_position_label", {
                          calle: data.placeData.calle,
                          altura: data.placeData.altura,
                          piso: data.placeData.piso_dpto,
                          interseccion: data.placeData.cruce,
                          locale: this.props.lang
                        })}
                      </Text>
                    ) : (
                      <Text style={[styles.subtitle, styles.fontColor]}>{`${
                        data.placeData.calle
                      } ${data.placeData.altura} ${
                        data.placeData.piso_dpto
                      }`}</Text>
                    )}
                  </View>
                  {data.distance !== undefined ? (
                    <View style={styles.establishmentDistance}>
                      <Icon
                        name="ios-walk"
                        style={{
                          fontSize: 14,
                          marginRight: "2%",
                          color: "#655E5E"
                        }}
                      />
                      <Text
                        style={[{ fontSize: 14, flex: 1 }, styles.fontColor]}
                      >
                        {I18n.t("place_distance_size", {
                          distance: parseInt(data.distance * 1000),
                          locale: this.props.lang
                        })}
                      </Text>
                    </View>
                  ) : null}
                  {data.placeData.tipo !== "" ? (
                    <Text style={[{ fontSize: 14, flex: 1 }, styles.fontColor]}>
                      {data.placeData.tipo}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.establishmentAdicionalInfo}>
                  <TouchableHighlight
                    activeOpacity={0.5}
                    underlayColor="white"
                    style={{
                      borderColor: "rgba(0, 0, 0, 0)",
                      elevation: 2,
                      flex: 1,
                      marginRight: "2.5%",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                      height: 45,
                      paddingVertical: "1%",
                      paddingHorizontal: "2.5%"
                    }}
                    onPress={() => {
                      !this.state.disabledButton
                        ? this._checkConection("map")
                        : null;
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        flex: 1,
                        justifyContent: "space-between"
                      }}
                    >
                      <View style={{ flex: 1, alignItems: "center" }}>
                        <Icon
                          name="md-pin"
                          style={{ fontSize: 25, color: "#e6334c" }}
                        />
                      </View>
                      <View style={{ flex: 2 }}>
                        <Text style={{ color: "#e6334c", flexWrap: "wrap" }}>
                          {I18n.t("panel_detail_general_map_localization", {
                            locale: this.props.lang
                          })}
                        </Text>
                      </View>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight
                    // activeOpacity={0.5}
                    // underlayColor="white"
                    style={{
                      borderColor: "rgba(0, 0, 0, 0)",
                      elevation: 2,
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                      height: 45,
                      paddingVertical: "1%"
                    }}
                  >
                    {this._renderAverageVote()}
                  </TouchableHighlight>
                </View>
                <View style={styles.establishmentServices}>
                  <Accordion
                    sections={this._getServicesAvailable()}
                    renderHeader={this._renderHeader}
                    renderContent={this._renderContent}
                    underlayColor="rgba(0, 0, 0, 0)"
                    initiallyActiveSection={indexService}
                    // underlayColor="rgba(230, 51, 76, 0.5)"
                  />
                </View>
                <View style={styles.shareContainer}>
                  <View style={styles.shareTitle}>
                    <Text
                      style={{
                        color: "#e6334c",
                        fontWeight: "bold",
                        fontSize: 16,
                        flex: 1,
                        textAlign: "center"
                      }}
                    >
                      {I18n.t("share_this_place", { locale: this.props.lang })}
                    </Text>
                  </View>
                  <View style={styles.shareBody}>
                    <View style={styles.socialShare}>
                      <Button
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 50,
                          justifyContent: "center",
                          alignItems: "center",
                          paddingTop: 0,
                          paddingRight: 0,
                          paddingLeft: 0,
                          paddingBottom: 0
                        }}
                        onPress={() => this._socialShare("whatsapp")}
                      >
                        <SVGWhatsappIcon height={25} width={25} />
                      </Button>
                    </View>
                    <View style={styles.socialShare}>
                      <Button
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 50,
                          justifyContent: "center",
                          alignItems: "center",
                          paddingTop: 0,
                          paddingRight: 0,
                          paddingLeft: 0,
                          paddingBottom: 0
                        }}
                        onPress={() => this._socialShare("messenger")}
                      >
                        <SVGMessengerIcon height={25} width={25} />
                      </Button>
                    </View>
                    <View style={styles.socialShare}>
                      <Button
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 50,
                          justifyContent: "center",
                          alignItems: "center",
                          paddingTop: 0,
                          paddingRight: 0,
                          paddingLeft: 0,
                          paddingBottom: 0
                        }}
                        onPress={() => this._socialShare("facebook")}
                      >
                        <SVGFacebookIcon height={25} width={25} />
                      </Button>
                    </View>
                    <View style={styles.socialShare}>
                      <Button
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 50,
                          justifyContent: "center",
                          alignItems: "center",
                          paddingTop: 0,
                          paddingRight: 0,
                          paddingLeft: 0,
                          paddingBottom: 0
                        }}
                        onPress={() => this._socialShare("twitter")}
                      >
                        <SVGTwitterIcon height={25} width={25} />
                      </Button>
                    </View>
                  </View>
                </View>
                <View style={styles.goToEvaluationContainer}>
                  <View>
                    <Button
                      bordered
                      style={{
                        borderColor: "rgba(0, 0, 0, 0)",
                        elevation: 2,
                        flex: 1
                      }}
                      onPress={() => {
                        !this.state.disabledButton
                          ? this._checkConection("evaluation")
                          : null;
                      }}
                    >
                      <Text style={{ color: "#e6334c", flexWrap: "wrap" }}>
                        {I18n.t("rate_this_place", { locale: this.props.lang })}
                      </Text>
                    </Button>
                  </View>
                </View>
                <View style={styles.evaluationContainer}>
                  <View style={styles.evaluationTitle}>
                    {this.props.commentsAvailable.length ? (
                      <Text
                        style={{
                          color: "#e6334c",
                          fontWeight: "bold",
                          fontSize: 16,
                          flex: 1,
                          textAlign: "center"
                        }}
                      >{`${this.props.commentsAvailable.length} ${
                        this.props.commentsAvailable.length !== 1
                          ? `${I18n.t("evaluation_plural", {
                              locale: this.props.lang
                            })}`
                          : `${I18n.t("evaluation_singular", {
                              locale: this.props.lang
                            })}`
                      }`}</Text>
                    ) : (
                      <Text
                        style={{
                          color: "#e6334c",
                          fontWeight: "bold",
                          fontSize: 16,
                          flex: 1,
                          textAlign: "center"
                        }}
                      >
                        {I18n.t("without_evaluations", {
                          locale: this.props.lang
                        })}
                      </Text>
                    )}
                  </View>
                  {this.props.commentsAvailable.length ? (
                    <View style={styles.evaluationBody}>
                      {this.props.commentsAvailable.map((comment, index) => {
                        let commentSearchArray = comment.que_busca.split(", "),
                          commentSearchArrayTranslated,
                          commentSearchTranslated;

                        commentSearchArrayTranslated = commentSearchArray.map(
                          search => I18n.t(search, { locale: this.props.lang })
                        );
                        commentSearchTranslated = commentSearchArrayTranslated.join(
                          ", "
                        );
                        return (
                          <View style={styles.evaluationItem} key={index}>
                            <View style={{ flexDirection: "row", flex: 1 }}>
                              <View style={{ paddingHorizontal: "2.5%" }}>
                                <Text
                                  style={{
                                    color: "#e6334c",
                                    fontWeight: "bold",
                                    fontSize: 24
                                  }}
                                >
                                  {comment.voto}
                                </Text>
                              </View>
                              <Text
                                style={[
                                  styles.fontColor,
                                  { flexWrap: "wrap", fontSize: 15, flex: 1 }
                                ]}
                              >
                                {comment.comentario}
                              </Text>
                            </View>
                            <View>
                              <Text
                                style={[
                                  styles.fontColor,
                                  { flexWrap: "wrap", fontSize: 12 }
                                ]}
                              >{`${I18n.t("comment_go_for_label", {
                                locale: this.props.lang
                              })} ${commentSearchTranslated}`}</Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  ) : null}
                </View>
                <Modal
                  animationType={"fade"}
                  transparent={true}
                  visible={this.state.showModal}
                  onRequestClose={() => {}}
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                      <View style={styles.modalViewTitle}>
                        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                          {I18n.t("map_popup_title", {
                            locale: this.props.lang
                          })}
                        </Text>
                      </View>
                      <View style={styles.modalViewDescription}>
                        <View style={styles.modalViewDescriptionIcon}>
                          <Icon
                            name="md-warning"
                            style={{ fontSize: 50, color: "#e6334c" }}
                          />
                        </View>
                        <Text
                          style={{ flex: 1, color: "#5d5d5d", fontSize: 16 }}
                        >
                          {this.state.modalText}
                        </Text>
                      </View>
                      <View style={styles.modalViewActions}>
                        <View>
                          <Button
                            onPress={() => this.setState({ showModal: false })}
                            // style={{marginBottom:'5%'}}
                          >
                            <Text
                              style={{
                                color: "#FFFFFF",
                                marginHorizontal: "20%"
                              }}
                            >
                              {I18n.t("back_label_button", {
                                locale: this.props.lang
                              })}
                            </Text>
                          </Button>
                        </View>
                      </View>
                    </View>
                  </View>
                </Modal>
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
  establishmentContainer: {
    marginTop: "10%",
    width: width / 1.2
  },
  establishmentHeader: {},
  establishmentName: {
    borderBottomWidth: 2,
    borderBottomColor: "#e6334c"
  },
  establishmentAddress: {
    marginTop: "1%",
    flexDirection: "row",
    alignItems: "center"
  },
  establishmentDistance: {
    flexDirection: "row",
    alignItems: "center"
  },
  establishmentAdicionalInfo: {
    flex: 1,
    marginTop: "2.5%",
    marginBottom: "3.5%",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  establishmentServices: {
    borderWidth: 2,
    borderColor: "#e6334c",
    borderRadius: 5
  },
  headerService: {
    borderBottomWidth: 2,
    borderBottomColor: "#e6334c",
    paddingVertical: "2%",
    flexDirection: "row"
  },
  lastHeaderService: {
    paddingVertical: "2%",
    flexDirection: "row"
  },
  headerServiceIcon: {
    borderRightWidth: 2,
    borderRightColor: "#e6334c",
    justifyContent: "center",
    padding: "1%"
  },
  headerServiceTitle: {
    color: "#e6334c",
    fontSize: 16
  },
  headerServiceTitleContainer: {
    justifyContent: "center",
    paddingLeft: "2.5%",
    flex: 1
  },
  serviceAditionalInfo: {
    backgroundColor: "#e6334c"
  },
  serviceAditionalInfoItem: {
    marginVertical: "1.5%",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "7%"
  },
  shareContainer: {
    marginVertical: "5%"
  },
  shareBody: {
    paddingVertical: "2%",
    borderBottomWidth: 2,
    borderBottomColor: "#e6334c",
    borderTopWidth: 2,
    borderTopColor: "#e6334c",
    flexDirection: "row",
    justifyContent: "space-around"
  },
  goToEvaluationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  evaluationContainer: {
    marginVertical: "5%"
  },
  evaluationTitle: {
    borderBottomWidth: 2,
    borderBottomColor: "#e6334c"
  },
  evaluationItem: {
    marginVertical: "5%"
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    paddingHorizontal: "5%"
  },
  modalView: {
    backgroundColor: "#FFFFFF",
    padding: "5%",
    borderRadius: 5
  },
  modalViewTitle: {
    alignItems: "center"
  },
  modalViewDescription: {
    marginVertical: "5%",
    flexDirection: "row",
    alignItems: "center"
  },
  modalViewDescriptionIcon: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: "5%"
  },
  modalViewActions: {
    justifyContent: "center",
    alignItems: "center"
  }
});
