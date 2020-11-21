import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  Linking,
  Picker,
  Modal,
  TouchableHighlight,
  ScrollView,
  Dimensions,
  PermissionsAndroid,
  Alert
} from "react-native";
import { Toast, Icon, Spinner } from "native-base";
import { connect } from "react-redux";
import { URL, TIME_STAMP_GPS_MIN } from "../../../config/HTTP/index.js";
import {
  setLang,
  selectLookingFor,
  setCurrentLocation,
  selectSearchEngine
} from "../../../constants/actions/index.js";
import {
  EN,
  ES,
  NEARBY,
  GEOLOCATE
} from "../../../constants/action-types/index.js";
import I18n from "../../../config/i18n/index.js";
import { HTTPService } from "../../../utils/HTTPServices/index.js";
import { Engine } from "../../../utils/engines";
// import Permissions from "react-native-permissions";
import ZendeskChat from "react-native-zendesk-chat";
import DeviceInfo from "react-native-device-info";
import SVGChatIcon from "../SVG/ChatIcon/component.js";

function mapStateToProps(store) {
  return { db: store.db, ui: store.ui };
}

const { width, height } = Dimensions.get("window");

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: props.ui.lang,
      modalVisible: false,
      modalType: false,
      showModalGPS: false
    };
  }

  componentWillReceiveProps = nextProps => {
    if (this.props.ui.lang !== nextProps.ui.lang)
      this.setState({ language: nextProps.ui.lang });
  };

  _setModalVisible = (visible, isFetching) =>
    !isFetching
      ? this.setState({ modalVisible: visible })
      : this.setState({ modalVisible: visible }, () => {
          HTTPService.cleanState();
          HTTPService.fetchPlaces();
          this.props.navigation.navigate("DrawerClose");
        });

  _reloadBD = () => {
    this._setModalVisible(true, false);
  };

  _refetch = () => this._setModalVisible(false, true);

  _goToAbout = () => {
    let url = `${URL}/#/acerca`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => {});
  };

  _goToSuggest = () => {
    let url = `${URL}/form`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => {});
  };

  _goToList = () => {
    let url = `${URL}/listado-paises`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => {});
  };

  _getDate = () => {
    let date = new Date(this.props.db.places.meta.updatedAt),
      dd = date.getDate(),
      mm = date.getMonth() + 1,
      yyyy = date.getFullYear();

    if (dd < 10) dd = `0${dd}`;
    if (mm < 10) mm = `0${mm}`;

    let formatDate = `${dd}/${mm}/${yyyy}`;

    return formatDate;
  };

  _goToNearby = async () => {
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
      if(granted === PermissionsAndroid.RESULTS.GRANTED){
        this.setState({ showModalGPS: true });
        this.props.dispatch(selectLookingFor(NEARBY));
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
              this.setState({
                modalVisible: true,
                modalType: true,
                showModalGPS: false
              });
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
                this.setState({
                  modalVisible: true,
                  modalType: true,
                  showModalGPS: false
                });
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
    // Permissions.check('location', 'always')
    //   .then(response => {
    //     if(response !== 'authorized') this.setState({modalVisible:true, modalType: true, showModalGPS:false})
    // })
  };

  _getAddress = async coords => {
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

        this._checkCountry(addressFormated, country);
      }
    } catch (e) {
      this._checkCountry(undefined, undefined);
    }

    this.Engine = new Engine(this.props.db.places.data, NEARBY);
    this.props.dispatch(selectSearchEngine(GEOLOCATE));
    this.Engine.searchForGeolocation(coords);
  };

  _checkCountry = (address, country) => {
    if (country !== undefined) {
      let isMember = true;
      if (
        country !== "AG" &&
        country !== "AR" &&
        country !== "AW" &&
        country !== "BB" &&
        country !== "BZ" &&
        country !== "BO" &&
        country !== "CL" &&
        country !== "CO" &&
        country !== "CW" &&
        country !== "DM" &&
        country !== "EC" &&
        country !== "SV" &&
        country !== "GD" &&
        country !== "GT" &&
        country !== "GY" &&
        country !== "HT" &&
        country !== "HN" &&
        country !== "JM" &&
        country !== "MX" &&
        country !== "PA" &&
        country !== "PY" &&
        country !== "PE" &&
        country !== "PR" &&
        country !== "DO" &&
        country !== "VC" &&
        country !== "LC" &&
        country !== "SR" &&
        country !== "TT" &&
        country !== "UY" &&
        country !== "VE"
      )
        isMember = false;

      if (!isMember) {
        this.setState({ showModalGPS: false }, () => {
          this.props.navigation.navigate("SearchForGeolocation", {
            address: address
          });
        });
      } else {
        this.setState({ showModalGPS: false }, () => {
          this.props.navigation.navigate("InfoCountry", { country: country });
        });
      }
    } else {
      this.setState({ showModalGPS: false }, () => {
        this.props.navigation.navigate("SearchForGeolocation");
      });
    }
  };

  _startZendeskChat = () => {
    ZendeskChat.startChat({
      name: "",
      email: "",
      phone: "user.mobile_phone",
      tags: [""],
      department: ""
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("../../../assets/images/vamos_logo.png")}
            style={styles.logo}
            resizeMode="cover"
          />
        </View>
        <ScrollView
        // style={{width: '100%'}}
        // contentContainerStyle ={{alignItems: 'left'}}
        >
          <View style={styles.body}>
            <View style={[styles.bodyItem, { marginBottom: height / 70 }]}>
              <Icon
                name="globe"
                style={{ fontSize: 24, color: "#e6334c" }}
              />
              {/* <Text style={styles.bodyItemText}>{I18n.t("language", {locale: this.props.ui.lang})}</Text> */}
              <View style={{ width: 100, paddingTop: 3 }}>
                <Picker
                  selectedValue={this.state.language}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ language: itemValue }, () => {
                      this.props.dispatch(setLang(itemValue));
                    })
                  }
                >
                  <Picker.Item label="ES" value={ES} color="#e6334c" />
                  <Picker.Item label="EN" value={EN} color="#e6334c" />
                </Picker>
              </View>
            </View>
            <View style={styles.bodyItem}>
              <TouchableHighlight
                onPress={this._goToAbout}
                activeOpacity={0.5}
                underlayColor="white"
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon
                    name="ios-information-circle"
                    style={{ fontSize: 24, color: "#e6334c" }}
                  />
                  <Text style={styles.bodyItemText}>
                    {I18n.t("go_to_about", { locale: this.props.ui.lang })}
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
            <View style={styles.bodyItem}>
              <TouchableHighlight
                onPress={this._goToSuggest}
                activeOpacity={0.5}
                underlayColor="white"
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon
                    name="ios-add-circle"
                    style={{ fontSize: 24, color: "#e6334c" }}
                  />
                  <Text style={styles.bodyItemText}>
                    {I18n.t("go_to_suggest", { locale: this.props.ui.lang })}
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
            <View style={styles.bodyItem}>
              <TouchableHighlight
                onPress={this._goToNearby}
                activeOpacity={0.5}
                underlayColor="white"
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon
                    name="ios-pin"
                    style={{ fontSize: 24, color: "#e6334c" }}
                  />
                  <Text style={styles.bodyItemText}>
                    {I18n.t("nearby", { locale: this.props.ui.lang })}
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
            <View style={styles.bodyItem}>
              <TouchableHighlight
                onPress={this._reloadBD}
                activeOpacity={0.5}
                underlayColor="white"
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon
                    name="md-refresh"
                    style={{ fontSize: 24, color: "#e6334c" }}
                  />
                  <Text style={styles.bodyItemText}>
                    {I18n.t("reload_bd", { locale: this.props.ui.lang })}
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
            <View style={styles.bodyItem}>
              <TouchableHighlight
                onPress={this._goToList}
                activeOpacity={0.5}
                underlayColor="white"
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon
                    name="globe"
                    style={{ fontSize: 24, color: "#e6334c" }}
                  />
                  <Text style={styles.bodyItemText}>
                    {I18n.t("list", { locale: this.props.ui.lang })}
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
            <View style={styles.bodyItem}>
              <TouchableHighlight
                onPress={this._startZendeskChat}
                activeOpacity={0.5}
                underlayColor="white"
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <SVGChatIcon
                    height={width / 14}
                    width={width / 14}
                    color={"#e6334c"}
                  />
                  <Text style={[styles.bodyItemText, { marginLeft: 15 }]}>
                    {I18n.t("chat_text_short", { locale: this.props.ui.lang })}
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <View style={styles.footerImage}>
            <Image
              source={require("../../../assets/images/logo-ippf-2020.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.footerImage}>
            <Image
              source={require("../../../assets/images/huesped_logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          {/* <Text>
              STAGING RELEASE
            </Text> */}
        </View>
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {}}
        >
          <View style={styles.modalContainer}>
            {this.state.modalType ? (
              <View style={styles.modalView}>
                <View style={styles.modalViewTitle}>
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    {I18n.t("nearby_gps_popup_title", {
                      locale: this.props.ui.lang
                    })}
                  </Text>
                </View>
                <View style={styles.modalViewDescriptionGPS}>
                  <View style={styles.modalViewDescriptionIcon}>
                    <Icon
                      name="md-warning"
                      style={{ fontSize: 50, color: "#e6334c" }}
                    />
                  </View>
                  <Text style={{ flex: 1, color: "#5d5d5d", fontSize: 16 }}>
                    {I18n.t("nearby_gps_popup_content", {
                      locale: this.props.ui.lang
                    })}
                  </Text>
                </View>
                <View style={styles.modalViewActions}>
                  <View>
                    <Button
                      onPress={() =>
                        this.setState({ modalVisible: false, modalType: false })
                      }
                      color="#e6334c"
                      title={I18n.t("back_label_button", {
                        locale: this.props.ui.lang
                      })}
                    />
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.modalView}>
                <View style={styles.modalViewTitle}>
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    {I18n.t("reload_bd_popup_title", {
                      locale: this.props.ui.lang
                    })}
                  </Text>
                </View>
                <View style={styles.modalViewDescription}>
                  <Text style={{ fontSize: 12, color: "#7f7f7f" }}>
                    {I18n.t("reload_bd_popup_last_date", {
                      locale: this.props.ui.lang,
                      date: this._getDate()
                    })}
                  </Text>
                  <Text>
                    {I18n.t("reload_bd_popup_content", {
                      locale: this.props.ui.lang
                    })}
                  </Text>
                </View>
                <View style={styles.modalViewActions}>
                  <View style={{ marginRight: "5%" }}>
                    <Button
                      onPress={this._refetch}
                      color="#e6334c"
                      title={I18n.t("confirm", { locale: this.props.ui.lang })}
                    />
                  </View>
                  <View>
                    <Button
                      onPress={() => this._setModalVisible(false, false)}
                      color="#e6334c"
                      title={I18n.t("cancel", { locale: this.props.ui.lang })}
                    />
                  </View>
                </View>
              </View>
            )}
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
                style={{ color: "#e6334c", textAlign: "center", fontSize: 18 }}
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
    );
  }
}

export default connect(mapStateToProps)(SideBar);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between"
  },
  header: {
    height: 100
  },
  body: {
    marginLeft: 20
  },
  bodyItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height / 25
  },
  bodyItemText: {
    fontSize: height / 35,
    color: "#e6334c",
    marginLeft: 20,
    fontFamily: "OpenSans"
  },
  footer: {
    justifyContent: "center"
  },
  footerImage: {
    height: 50,
    marginBottom: 20
  },
  logo: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  button: {},
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    paddingHorizontal: "5%"
  },
  modalView: {
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    padding: "2.5%"
  },
  modalViewTitle: {
    alignItems: "center"
  },
  modalViewDescription: {
    marginVertical: "5%"
  },
  modalViewDescriptionGPS: {
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
    flexDirection: "row",
    justifyContent: "center"
  }
});
