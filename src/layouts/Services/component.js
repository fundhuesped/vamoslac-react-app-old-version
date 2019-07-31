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
  Icon,
  Spinner
} from "native-base";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  TextInput,
  TouchableHighlight,
  Modal,
  Keyboard,
  TouchableOpacity,
  BackHandler,
  PermissionsAndroid,
  Alert
} from "react-native";

import { StyleProvider } from "native-base";
import getTheme from "../../config/styles/native-base-theme/components";
import platform from "../../config/styles/native-base-theme/variables/platform";
import SVGVamosLogo from "../../components/Dummy/SVG/VamosLogo/component.js";
import I18n from "../../config/i18n/index.js";
import CitiesList from "../../components/Dummy/CitiesList/component.js";
// import Permissions from "react-native-permissions";
import SVGChatIcon from "../../components/Dummy/SVG/ChatIcon/component.js";

import { getServiceData } from "../../utils/engines/index.js";

import { Engine } from "../../utils/engines";

import {
  selectSearchEngine,
  setCurrentLocation
} from "../../constants/actions/index.js";

import { TIME_STAMP_GPS_MIN } from "../../config/HTTP/index.js";

import { AUTOCOMPLETE, GEOLOCATE } from "../../constants/action-types/index.js";

import {
  CON,
  VIH,
  SSR,
  MAC,
  LPI,
  DC,
  TEEN
} from "../../constants/action-types";

const { width } = Dimensions.get("window");

export default class Services extends React.Component {
  constructor() {
    super();
    this.state = {
      textInput: "",
      showModal: false,
      filterCities: [],
      showList: false,
      itemSelected: null,
      showModalGPS: false
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

  _sendToInfoCountryGEOLOCATE = async () => {
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
        Keyboard.dismiss();
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
              this.setState({ showModal: true, showModalGPS: false });
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
                this.setState({ showModal: false });
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
    //     if(response !== 'authorized') this.setState({showModal:true, showModalGPS: false})
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

    this.Engine = new Engine(
      this.props.db.places.data,
      this.props.ui.lookingFor
    );
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
          this.props.navigation.navigate("InfoCountry", {
            country: country,
            address: address
          });
        });
      }
    } else {
      this.setState({ showModalGPS: false }, () => {
        this.props.navigation.navigate("SearchForGeolocation");
      });
    }
  };

  _filterList = () => {
    if (this.state.itemSelected === null) this._isInputFocus(true);
    if (this.state.textInput.length > 1) {
      let cities = this.props.db.cities,
        filterCities = cities
          .filter(city => {
            let cityString, departmentString;
            if (
              city.nombre_ciudad !== undefined &&
              city.nombre_ciudad !== null &&
              city.nombre_ciudad !== ""
            ) {
              cityString = city.nombre_ciudad.toLowerCase();
              //CUT Diacritics cityString
              cityString = cityString.replace(/\s/g, "");
              cityString = cityString.replace(/[àáâãäå]/g, "a");
              cityString = cityString.replace(/[èéêëēę]/g, "e");
              cityString = cityString.replace(/[îïíīìį]/g, "i");
              cityString = cityString.replace(/[ôöòóøōõ]/g, "o");
              cityString = cityString.replace(/[ûüùúū]/g, "u");
              cityString = cityString.replace(/[çćč]/g, "c");
            } else cityString = "";

            if (
              city.nombre_partido !== undefined &&
              city.nombre_partido !== null
            ) {
              departmentString = city.nombre_partido.toLowerCase();

              //CUT Diacritics departmentString
              departmentString = departmentString.replace(/\s/g, "");
              departmentString = departmentString.replace(/[àáâãäå]/g, "a");
              departmentString = departmentString.replace(/[èéêëēę]/g, "e");
              departmentString = departmentString.replace(/[îïíīìį]/g, "i");
              departmentString = departmentString.replace(/[ôöòóøōõ]/g, "o");
              departmentString = departmentString.replace(/[ûüùúū]/g, "u");
              departmentString = departmentString.replace(/[çćč]/g, "c");
            } else departmentString = "";

            //CUT Diacritics textInputString
            let textInputString = this.state.textInput.toLowerCase();
            textInputString = textInputString.replace(/\s/g, "");
            textInputString = textInputString.replace(/[àáâãäå]/g, "a");
            textInputString = textInputString.replace(/[èéêëēę]/g, "e");
            textInputString = textInputString.replace(/[îïíīìį]/g, "i");
            textInputString = textInputString.replace(/[ôöòóøōõ]/g, "o");
            textInputString = textInputString.replace(/[ûüùúū]/g, "u");
            textInputString = textInputString.replace(/[çćč]/g, "c");

            if (
              cityString.includes(textInputString) ||
              departmentString.includes(textInputString)
            )
              return city;
          })
          .reverse();

      this.setState({ filterCities });
    }
  };

  _onPressItem = item => {
    let label,
      cityString =
        item.nombre_ciudad !== undefined &&
        item.nombre_ciudad !== null &&
        item.nombre_ciudad !== ""
          ? `${item.nombre_ciudad},`
          : "",
      departmentString =
        item.nombre_partido !== undefined && item.nombre_partido !== null
          ? `${item.nombre_partido},`
          : "",
      provinceString =
        item.nombre_provincia !== undefined && item.nombre_provincia !== null
          ? `${item.nombre_provincia},`
          : "",
      countryString =
        item.nombre_pais !== undefined && item.nombre_pais !== null
          ? item.nombre_pais
          : "";

    label = `${cityString} ${departmentString} ${provinceString} ${countryString}`;

    this.setState(
      { textInput: label, showList: false, itemSelected: item },
      this._sendToInfoCountryAUTOCOMPLETE
    );
    Keyboard.dismiss();
  };

  _sendToInfoCountryAUTOCOMPLETE = () => {
    setTimeout(() => {
      this.setState({ textInput: "" });
      this.Engine = new Engine(
        this.props.db.places.data,
        this.props.ui.lookingFor
      );
      this.props.dispatch(selectSearchEngine(AUTOCOMPLETE));
      this.Engine.searchForAutocomplete(this.state.itemSelected);
      this.props.navigation.navigate("InfoCountry", {
        cityDepartment: this.state.itemSelected
      });
    }, 10);
  };

  _renderListResults = () => {
    return this.state.textInput !== "" &&
      this.state.textInput.length > 1 &&
      this.state.showList ? (
      <View style={{ flex: 1 }}>
        <View style={styles.flatlistContainer}>
          <CitiesList
            data={this.state.filterCities}
            onPressItem={this._onPressItem}
          />
        </View>
      </View>
    ) : null;
  };

  _isInputFocus = isFocus => this.setState({ showList: isFocus });

  _goToLanding = () => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "Drawer" })]
    });
    this.props.navigation.dispatch(resetAction);
  };

  render() {
    let serviceData = getServiceData(this.props.serviceTypeData, width / 10);
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
          <Content
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flex: 1,
              backgroundColor: "#FFFFFF",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={1}
              onPress={() => this._isInputFocus(false)}
            >
              <View style={styles.container}>
                <View style={styles.headerService}>
                  <View style={styles.headerServiceIcon}>
                    {serviceData.svg}
                  </View>
                  <View style={styles.headerServiceTitleContainer}>
                    <Text style={styles.headerServiceTitle}>
                      {serviceData.title.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.infoContainerText}>
                    {serviceData.subtitle}
                  </Text>
                </View>
                <TouchableHighlight
                  onPress={() => {
                    this.props.chat();
                  }}
                  style={styles.chatBox}
                  activeOpacity={0.5}
                  underlayColor="#E32E43"
                >
                  <View style={styles.boxContent}>
                    <SVGChatIcon height={width / 11} width={width / 11} />
                    <Text style={[styles.boxContentText, { color: "#FFFFFF" }]}>
                      {I18n.t("chat_text_extend", {
                        locale: this.props.ui.lang
                      })}
                    </Text>
                  </View>
                </TouchableHighlight>
                <View style={styles.inputContainer}>
                  <View style={styles.containerSearchCity}>
                    <Icon
                      name="md-search"
                      style={{ fontSize: 30, color: "#FFFFFF" }}
                    />
                    <TextInput
                      multiline={true}
                      style={styles.textInput}
                      onChangeText={text =>
                        this.setState(
                          { textInput: text, itemSelected: null },
                          this._filterList
                        )
                      }
                      value={this.state.textInput}
                      placeholder={I18n.t("search_department_description", {
                        locale: this.props.ui.lang
                      })}
                      underlineColorAndroid="rgba(0,0,0,0)"
                      // onSubmitEditing={ () => alert('buscar')}
                      onFocus={() => {
                        if (this.state.itemSelected === null)
                          this._isInputFocus(true);
                      }}
                      // onBlur={() => this._isInputFocus(false)}
                    />
                  </View>
                </View>
                {this._renderListResults()}
                <TouchableHighlight
                  onPress={this._sendToInfoCountryGEOLOCATE}
                  style={{ borderRadius: 5, marginTop: "2.5%" }}
                  activeOpacity={0.5}
                  underlayColor="#e6334c"
                >
                  <View style={styles.containerGeolocation}>
                    <Icon
                      name="md-pin"
                      style={{ fontSize: 30, color: "#FFFFFF" }}
                    />
                    <View style={{ marginLeft: "7%" }}>
                      <Text style={{ color: "rgba(0,0,0,0.4)" }}>
                        {I18n.t("search_by_location", {
                          locale: this.props.ui.lang
                        })}
                      </Text>
                    </View>
                  </View>
                </TouchableHighlight>
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
                          {I18n.t("search_gps_popup_content", {
                            locale: this.props.ui.lang
                          })}
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
            </TouchableOpacity>
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: "5%",
    width: width / 1.2,
    height: 150
  },
  headerService: {
    borderBottomWidth: 2,
    borderBottomColor: "#e6334c",
    paddingBottom: "3%",
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
    fontSize: 20
  },
  headerServiceTitleContainer: {
    justifyContent: "center",
    paddingLeft: "2.5%",
    flex: 1
  },
  infoContainer: {
    marginTop: "2.5%"
  },
  infoContainerText: {
    fontSize: 12,
    color: "#655E5E",
    textAlign: "left"
  },
  inputContainer: {
    backgroundColor: "#e6334c",
    marginTop: "2.5%",
    borderRadius: 5,
    paddingLeft: "5%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  textInput: {
    marginLeft: "5%",
    marginRight: "2.5%",
    flex: 1,
    color: "#FFFFFF",
    height: 55
  },
  containerSearchCity: {
    borderRadius: 5,
    flexDirection: "row",
    paddingVertical: "2%",
    alignItems: "center"
  },
  containerGeolocation: {
    borderRadius: 5,
    width: "100%",
    height: 55,
    paddingVertical: "0.3%",
    paddingLeft: "5%",
    alignItems: "center",
    backgroundColor: "#e6334c",
    flexDirection: "row"
  },
  flatlistContainer: {
    height: 200,
    position: "absolute",
    paddingVertical: 20,
    width: "80%",
    marginLeft: "2.5%",
    backgroundColor: "#FFFFFF",
    elevation: 4,
    zIndex: 10
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
  },
  chatBox: {
    elevation: 2,
    width: "100%",
    height: 70,
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#E32E43",
    borderRadius: 5,
    backgroundColor: "#E32E43"
  },
  boxContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: width / 35
  },
  boxContentText: {
    textAlign: "center",
    paddingHorizontal: 10,
    color: "#e6354d",
    fontFamily: "OpenSans",
    fontSize: width / 28
  }
});
