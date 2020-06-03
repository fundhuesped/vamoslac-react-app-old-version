import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Dimensions,
  ScrollView,
  Modal,
  PermissionsAndroid,
  Alert,
  PixelRatio
} from "react-native";
import {
  Container,
  Header,
  Content,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Spinner
} from "native-base";
import { StyleProvider } from "native-base";
import getTheme from "../../config/styles/native-base-theme/components";
import platform from "../../config/styles/native-base-theme/variables/platform";

import {
  selectLookingFor,
  setCurrentLocation,
  selectSearchEngine
} from "../../constants/actions/index.js";
import I18n from "../../config/i18n/index.js";
import { TIME_STAMP_GPS_MIN } from "../../config/HTTP/index.js";
import { Engine } from "../../utils/engines";

import SVGVamosLogo from "../../components/Dummy/SVG/VamosLogo/component.js";
import SVGCondomIcon from "../../components/Dummy/SVG/CondomIcon/component.js";
import SVGDetectionIcon from "../../components/Dummy/SVG/DetectionIcon/component.js";
import SVGHealthIcon from "../../components/Dummy/SVG/HealthIcon/component.js";
import SVGILEIcon from "../../components/Dummy/SVG/ILEIcon/component.js";
import SVGMACIcon from "../../components/Dummy/SVG/MACIcon/component.js";
import SVGTeenIcon from "../../components/Dummy/SVG/TeenIcon/component.js";
import SVGVIHIcon from "../../components/Dummy/SVG/VIHIcon/component.js";
import SVGChatIcon from "../../components/Dummy/SVG/ChatIcon/component.js";
import Permissions from "react-native-permissions";

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

export default class Landing extends React.Component {
  constructor() {
    super();
    this.state = {
      showModalErrorGPS: false,
      showModalGPS: false,
      buttonId: ""
    };
  }

  componentDidMount = () => this.props.updateData();

  _handleService = service => {
    if (service !== "TEEN") {
      this.props.dispatch(selectLookingFor(service));
      this.props.navigation.navigate("Services", {
        service: service,
        cleanState: this._cleanState
      });
    }
  };

  _cleanState = () => this.setState({ buttonId: "" });

  _goToGeolocation = async () => {
    const titleAlert = I18n.t("title_error_geolocation", {
      locale: this.props.ui.lang
    })
    const alertContent = I18n.t("alert_error_geolocation", {
      locale: this.props.ui.lang
    })

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({ showModalGPS: true });
        this._handleService(TEEN);
        if (
          this.props.ui.searchEngine.userInput.GEOLOCATE.timeStamp === undefined
        ) {
          navigator.geolocation.getCurrentPosition(
            position => {
              this.props.dispatch(
                setCurrentLocation(
                  position.coords.latitude,
                  position.coords.longitude
                )
              );
              this._getAddress(position.coords);
            },
            error => {
              this.setState({ showModalErrorGPS: true, showModalGPS: false });
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 }
          );
        } else {
          let currentTime = new Date(),
            timeStamp = this.props.ui.searchEngine.userInput.GEOLOCATE.timeStamp;
    
          if (
            currentTime.getTime() - timeStamp.getTime() >=
            TIME_STAMP_GPS_MIN * 60 * 1000
          ) {
            navigator.geolocation.getCurrentPosition(
              position => {
                this.props.dispatch(
                  setCurrentLocation(
                    position.coords.latitude,
                    position.coords.longitude
                  )
                );
                this._getAddress(position.coords);
              },
              error => {
                this.setState({ showModalErrorGPS: false });
              },
              { enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 }
            );
          } else
            this._getAddress(
              this.props.ui.searchEngine.userInput.GEOLOCATE.currentLocation
            );
        }
      } else {
        Alert.alert(titleAlert, alertContent)
      }
    } catch (error) {
      Alert.alert(titleAlert, alertContent)
    }

  };

  _getAddress = async coords => {
    this.props.dispatch(selectSearchEngine(TEEN));
    this.props.dispatch(selectLookingFor(TEEN));
    this.Engine = new Engine(this.props.db.places.data, TEEN);
    this.Engine.searchForTeen(coords);

    let url = `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCjb5c-5XvzhvdMXCjIjNaK-Zdh-L_qVmM&latlng=${
      coords.latitude
    },${coords.longitude}&sensor=false`;
    try {
      let response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });
      let responseJson = await response.json();

      if (responseJson.status !== "OK") {
        // alert('FAIL GEOCODIGN');
      } else {
        let address = {};
        const address_components = responseJson.results[0].address_components;
        let country;
        address_components.forEach(element => {
          address[element.types[0]] = element.long_name;
          if (element.types[0] === "country") country = element.short_name;
        });

        let addressFormated = {
          formatted_address: responseJson.results[0].formatted_address,
          address_parts: address
        };
        this.setState({ showModalGPS: false });
        this.props.navigation.navigate("SearchForGeolocation", {
          address: addressFormated
        });
      }
    } catch (e) {
      this.setState({ showModalGPS: false });
      this.props.navigation.navigate("SearchForGeolocation");
    }
  };

  _handleOnPress = id => {
    // alert(id+' '+this.state.buttonId)
    if (this.state.buttonId !== "") {
      if (id !== this.state.buttonId) {
        // this._handleService(id)
      }
    } else this.setState({ buttonId: id }, () => this._handleService(id));
  };

  render() {
    return (
      <StyleProvider style={getTheme(platform)}>
        <Container>
          <Header
            androidStatusBarColor="#E6642F"
            style={{ backgroundColor: "#E6642F" }}
          >
            <Left style={{ flex: 1 }} />
            <Body style={{ flex: 1 }}>
              <SVGVamosLogo height={140} width={140} />
            </Body>
            <Right style={{ flex: 1 }}>
              <Button
                transparent
                onPress={() => this.props.navigation.navigate("DrawerOpen")}
              >
                <Icon name="menu" style={{ fontSize: 24 }} />
              </Button>
            </Right>
          </Header>
          <Content
            contentContainerStyle={{
              flex: 1,
              backgroundColor: "#FFFFFF"
            }}
          >
            <ScrollView style={styles.scrollContainer}>
              <View style={styles.container}>
                <TouchableHighlight
                  onPress={() => {
                    this.props.chat();
                  }}
                  style={styles.chatBox}
                  activeOpacity={0.5}
                  underlayColor="#E32E43"
                >
                  <View style={[styles.boxContent]}>
                    <SVGChatIcon height={width / 7} width={width / 7} />
                    <Text style={[styles.boxContentText, { color: "#FFFFFF" }]}>
                      {I18n.t("chat_text_middle", {
                        locale: this.props.ui.lang
                      })}
                    </Text>
                  </View>
                </TouchableHighlight>
                <View style={styles.row}>
                  <View style={styles.column}>
                    <TouchableHighlight
                      // onPress={()=>{this._handleService(CON)}}
                      onPress={() => {
                        this._handleOnPress(CON);
                      }}
                      style={styles.box}
                      activeOpacity={0.5}
                      underlayColor="white"
                    >
                      <View style={styles.boxContent}>
                        <SVGCondomIcon height={width / 7} width={width / 7} />
                        <Text style={styles.boxContentText}>
                          {I18n.t("condones_name", {
                            locale: this.props.ui.lang
                          })}
                        </Text>
                      </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                      onPress={() => {
                        this._handleOnPress(MAC);
                      }}
                      style={styles.box}
                      activeOpacity={0.5}
                      underlayColor="white"
                    >
                      <View style={styles.boxContent}>
                        <SVGMACIcon height={width / 7} width={width / 7} />
                        <Text style={styles.boxContentText}>
                          {I18n.t("mac_name", { locale: this.props.ui.lang })}
                        </Text>
                      </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                      onPress={() => {
                        this._handleOnPress(DC);
                      }}
                      style={styles.box}
                      activeOpacity={0.5}
                      underlayColor="white"
                    >
                      <View style={styles.boxContent}>
                        <SVGDetectionIcon
                          height={width / 7}
                          width={width / 7}
                        />
                        <Text style={styles.boxContentText}>
                          {I18n.t("dc_name", { locale: this.props.ui.lang })}
                        </Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                  <View style={styles.column}>
                    <TouchableHighlight
                      onPress={() => {
                        this._handleOnPress(VIH);
                      }}
                      style={styles.box}
                      activeOpacity={0.5}
                      underlayColor="white"
                    >
                      <View style={styles.boxContent}>
                        <SVGVIHIcon height={width / 7} width={width / 7} />
                        <Text style={styles.boxContentText}>
                          {I18n.t("prueba_name", {
                            locale: this.props.ui.lang
                          })}
                        </Text>
                      </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                      onPress={() => {
                        this._handleOnPress(LPI);
                      }}
                      style={styles.box}
                      activeOpacity={0.5}
                      underlayColor="white"
                    >
                      <View style={styles.boxContent}>
                        <SVGILEIcon height={width / 7} width={width / 7} />
                        <Text style={[styles.boxContentText, {fontSize: width / 36}]}>
                          {I18n.t("ile_name", { locale: this.props.ui.lang })}
                        </Text>
                      </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                      onPress={() => {
                        this._handleOnPress(SSR);
                      }}
                      style={styles.box}
                      activeOpacity={0.5}
                      underlayColor="white"
                    >
                      <View style={styles.boxContent}>
                        <SVGHealthIcon height={width / 8} width={width / 8} />
                        <Text style={[styles.boxContentText, {fontSize: width / 38}]}>
                          {I18n.t("ssr_name", { locale: this.props.ui.lang })}
                        </Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                </View>
                <View style={styles.lastRow}>
                  <TouchableHighlight
                    onPress={() => {
                      this._goToGeolocation();
                    }}
                    style={[styles.lastBox]}
                    activeOpacity={0.5}
                    underlayColor="white"
                  >
                    <View style={styles.lastboxContent}>
                      <SVGTeenIcon height={width / 7} width={width / 7} />
                      <Text style={styles.boxContentText}>
                        {I18n.t("friendly_service_label", {
                          locale: this.props.ui.lang
                        })}
                      </Text>
                    </View>
                  </TouchableHighlight>
                </View>
                <Modal
                  animationType={"fade"}
                  transparent={true}
                  visible={this.state.showModalErrorGPS}
                  onRequestClose={() => {}}
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                      <View style={styles.modalViewTitle}>
                        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                          {I18n.t("nearby_gps_popup_title", {
                            locale: this.props.ui.lang
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
                          {I18n.t("friendly_gps_popup_content", {
                            locale: this.props.ui.lang
                          })}
                        </Text>
                      </View>
                      <View style={styles.modalViewActions}>
                        <View>
                          <Button
                            onPress={() =>
                              this.setState({ showModalErrorGPS: false })
                            }
                            // style={{marginBottom:'5%'}}
                          >
                            <Text
                              style={{
                                color: "#FFFFFF",
                                marginHorizontal: "20%"
                              }}
                            >
                              {I18n.t("back_label_button", {
                                locale: this.props.ui.lang
                              })}
                            </Text>
                          </Button>
                        </View>
                      </View>
                    </View>
                  </View>
                </Modal>
                <Modal
                  animationType={"fade"}
                  transparent={true}
                  visible={this.state.showModalGPS}
                  onRequestClose={() => {}}
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                      <Text
                        style={{
                          color: "#e6334c",
                          textAlign: "center",
                          fontSize: 18
                        }}
                      >
                        {I18n.t("spinner_getting_coordenates_label", {
                          locale: this.props.ui.lang
                        })}
                      </Text>
                      <Spinner color="#e6334c" />
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
  scrollContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: width / 12
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  lastRow: {
    flex: 1
  },
  box: {
    elevation: 2,
    width: width / 2.6,
    height: width / 3.6,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0)",
    borderRadius: 20
  },
  chatBox: {
    elevation: 2,
    width: "100%",
    height: width / 3.6,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: "#E32E43",
    borderRadius: 20,
    backgroundColor: "#E32E43"
  },
  lastBox: {
    elevation: 2,
    height: width / 5.6,
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0)",
    borderRadius: 20
  },
  boxContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  lastboxContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40
  },
  boxContentText: {
    textAlign: "center",
    paddingHorizontal: 10,
    color: "#e6354d",
    fontFamily: "OpenSans",
    fontSize: width / 35
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
