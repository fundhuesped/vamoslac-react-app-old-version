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
  Spinner,
  CheckBox,
  DeviceEventEmitter
} from "native-base";
import {
  View,
  StyleSheet,
  Picker,
  NetInfo,
  Modal,
  Text,
  Dimensions,
  TouchableHighlight,
  BackHandler,
  Linking
} from "react-native";
import { StyleProvider } from "native-base";
import getTheme from "../../config/styles/native-base-theme/components";
import platform from "../../config/styles/native-base-theme/variables/platform";
import PlacePreviewList from "../../components/Dummy/PlacePreviewList/component.js";
import SVGVamosLogo from "../../components/Dummy/SVG/VamosLogo/component.js";
import I18n from "../../config/i18n/index.js";
import { URL } from "../../config/HTTP/index.js";
import SVGChatIcon from "../../components/Dummy/SVG/ChatIcon/component.js";

import { RATE, DISTANCE, TEEN } from "../../constants/action-types/index.js";

import { getServiceData } from "../../utils/engines/index.js";

import PlacePreviewItem from "../../components/Dummy/PlacePreviewItem/component.js";

const { width } = Dimensions.get("window");

export default class SearchForGeolocation extends React.Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      sortEngine: RATE,
      address: null,
      showModal: false,
      isTeen: false,
      disabledButtonMap: false
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

  componentDidMount = () => {
    if (
      this.props.store[0] === undefined ||
      this.props.store[0].empty === undefined
    )
      this.setState({ loaded: true });
    this.setState({ address: this.props.address });
  };

  componentWillReceiveProps = nextProps => {
    if (
      nextProps.store[0] === undefined ||
      nextProps.store[0].empty === undefined
    )
      this.setState({ loaded: true });
  };

  _goToMap = () => {
    this.setState({ disabledButtonMap: true });
    NetInfo.isConnected.fetch().then(isConnected => {
      let conection = isConnected ? "online" : "offline";
      isConnected
        ? this.props.navigation.navigate("Map", {
            coords: this.props.coords,
            cleanState: this._cleanState
          })
        : this.setState({ showModal: true, disabledButtonMap: true });
    });
  };

  _cleanState = () => this.setState({ disabledButtonMap: false });

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

  _renderView = () => {
    let view;
    if (this.state.loaded) {
      if (this.props.store.length !== 0) {
        view = (
          <View>
            <PlacePreviewList
              store={this.props.store}
              navigation={this.props.navigation}
            />
          </View>
        );
      } else {
        view = (
          <View style={{ marginTop: "5%", flexDirection: "row" }}>
            <Text style={{ color: "#e6334c", paddingBottom: 7 }} onPress={this._goToSuggest}>
              {I18n.t("autocomplete_not_found_result_label", {
                locale: this.props.lang
              })}
            </Text>
            <Text
              style={{ color: "#e6334c", textDecorationLine: "underline" }}
              onPress={this._goToSuggest}
            >
              {I18n.t("autocomplete_not_found_result_label_underline", {
                locale: this.props.lang
              })}
            </Text>
          </View>
        );
      }
    } else {
      view = (
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 20, color: "#655E5E" }}>
            {I18n.t("cargando_cercanos", { locale: this.props.lang })}
          </Text>
          <Spinner color="#e6334c" />
        </View>
      );
    }

    return view;
  };

  _goToLanding = () => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "Drawer" })]
    });
    this.props.navigation.dispatch(resetAction);
  };

  render() {
    let serviceData = getServiceData(this.props.serviceTypeData, width / 10);
    let location = {
      pais: this.state.address,
      provincia: false,
      partido: false,
      ciudad: false
    };
    if (
      typeof this.state.address !== "string" &&
      this.state.address !== null &&
      this.state.address !== undefined
    )
      location = {
        pais: this.state.address.nombre_pais || null,
        provincia: this.state.address.nombre_provincia || null,
        partido: this.state.address.nombre_partido || null,
        ciudad: this.state.address.nombre_ciudad || null
      };
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
            <View style={styles.container}>
              <View style={styles.headerService}>
                <View style={styles.headerServiceIcon}>{serviceData.svg}</View>
                <View style={styles.headerServiceTitleContainer}>
                  <Text style={styles.headerServiceTitle}>
                    {serviceData.title.toUpperCase()}
                  </Text>
                </View>
              </View>
              {this.state.address !== null ? (
                <View style={styles.serviceBreadcrumbLocation}>
                  {this.props.searchEngine ? (
                    <Text style={styles.serviceBreadcrumbLocationText}>
                      {I18n.t("busqueda_auto_acc", { locale: this.props.lang })}
                    </Text>
                  ) : (
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignItems: "center"
                      }}
                    >
                      {location.pais ? (
                        <Text style={styles.serviceBreadcrumbLocationText}>
                          {location.pais}
                        </Text>
                      ) : null}
                      {location.pais ? (
                        <Icon
                          name="ios-arrow-forward"
                          style={{
                            fontSize: 12,
                            color: "#e6334c",
                            marginHorizontal: "2%"
                          }}
                        />
                      ) : null}
                      {location.provincia ? (
                        <Text style={styles.serviceBreadcrumbLocationText}>
                          {location.provincia}
                        </Text>
                      ) : null}
                      {location.provincia ? (
                        <Icon
                          name="ios-arrow-forward"
                          style={{
                            fontSize: 12,
                            color: "#e6334c",
                            marginHorizontal: "2%"
                          }}
                        />
                      ) : null}
                      {location.partido ? (
                        <Text style={styles.serviceBreadcrumbLocationText}>
                          {location.partido}
                        </Text>
                      ) : null}
                      {location.partido ? (
                        <Icon
                          name="ios-arrow-forward"
                          style={{
                            fontSize: 12,
                            color: "#e6334c",
                            marginHorizontal: "2%"
                          }}
                        />
                      ) : null}
                      {location.ciudad ? (
                        <Text style={styles.serviceBreadcrumbLocationText}>
                          {location.ciudad}
                        </Text>
                      ) : null}
                    </View>
                  )}
                </View>
              ) : null}
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
                    {I18n.t("chat_text_extend", { locale: this.props.lang })}
                  </Text>
                </View>
              </TouchableHighlight>
              {this.props.store.length !== 0 ? (
                <View>
                  {this.props.serviceTypeData === TEEN ? (
                    <View style={styles.infoContainer}>
                      <Text style={styles.infoContainerText}>
                        {serviceData.subtitle}
                      </Text>
                    </View>
                  ) : null}
                  {this.props.serviceTypeData !== TEEN ? (
                    <TouchableHighlight
                      onPress={() =>
                        this.setState({ isTeen: !this.state.isTeen }, () =>
                          this.props._changeSortValue(TEEN, this.state.isTeen)
                        )
                      }
                      activeOpacity={0}
                      underlayColor="#FFFFFF"
                      style={{ marginTop: "2.5%" }}
                    >
                      <View style={styles.isTeenContainer}>
                        <CheckBox
                          onPress={() =>
                            this.setState({ isTeen: !this.state.isTeen }, () =>
                              this.props._changeSortValue(
                                TEEN,
                                this.state.isTeen
                              )
                            )
                          }
                          checked={this.state.isTeen}
                          color={"#e6334c"}
                        />
                        <Text
                          style={[
                            { marginLeft: 20, flex: 1 },
                            styles.serviceBreadcrumbLocationText
                          ]}
                        >
                          {I18n.t("only_teenager_friendly", {
                            locale: this.props.lang
                          })}
                        </Text>
                      </View>
                    </TouchableHighlight>
                  ) : null}
                  <View style={styles.serviceContainerSort}>
                    <Text style={{ flex: 1, color: "#655E5E" }}>{`${I18n.t(
                      "sort_label_text",
                      { locale: this.props.lang }
                    )}`}</Text>
                    <View style={styles.serviceContainerSortInput}>
                      {this.props.searchEngine ? (
                        <Picker
                          selectedValue={this.state.sortEngine}
                          onValueChange={(itemValue, itemIndex) =>
                            this.setState({ sortEngine: itemValue }, () => {
                              this.props._changeSortValue(itemValue);
                            })
                          }
                        >
                          <Picker.Item
                            label={I18n.t("sort_better_option", {
                              locale: this.props.lang
                            })}
                            value={RATE}
                            color="#000"
                          />
                          <Picker.Item
                            label={I18n.t("all", { locale: this.props.lang })}
                            value={"ALL"}
                            color="#000"
                          />
                          <Picker.Item
                            label={I18n.t("sort_closest_option", {
                              locale: this.props.lang
                            })}
                            value={DISTANCE}
                            color="#000"
                          />
                        </Picker>
                      ) : (
                        <Picker
                          selectedValue={this.state.sortEngine}
                          onValueChange={(itemValue, itemIndex) =>
                            this.setState({ sortEngine: itemValue }, () => {
                              this.props._changeSortValue(itemValue);
                            })
                          }
                        >
                          <Picker.Item
                            label={I18n.t("sort_better_option", {
                              locale: this.props.lang
                            })}
                            value={RATE}
                            color="#000"
                          />
                          <Picker.Item
                            label={I18n.t("all", { locale: this.props.lang })}
                            value={"ALL"}
                            color="#000"
                          />
                        </Picker>
                      )}
                    </View>
                  </View>
                  <View style={styles.serviceGeolocation}>
                    <Button
                      bordered
                      block
                      style={{ borderColor: "rgba(0, 0, 0, 0)", elevation: 2 }}
                      onPress={
                        !this.state.disabledButtonMap ? this._goToMap : null
                      }
                    >
                      <Icon
                        name="md-pin"
                        style={{ fontSize: 25, color: "#e6334c" }}
                      />
                      <Text style={{ color: "#e6334c" }}>
                        {I18n.t("panel_detail_general_map_localization", {
                          locale: this.props.lang
                        })}
                      </Text>
                    </Button>
                  </View>
                </View>
              ) : null}
              <View style={styles.flatlistContainer}>{this._renderView()}</View>
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
                        {I18n.t("rate_popup_title", {
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
                      <Text style={{ flex: 1, color: "#5d5d5d", fontSize: 16 }}>
                        {I18n.t("map_popup_content", {
                          locale: this.props.lang
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
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "5%",
    width: width / 1.2
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
  serviceBreadcrumbLocation: {
    alignItems: "center",
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#e6334c",
    flexWrap: "wrap"
  },
  serviceBreadcrumbLocationText: {
    color: "#655E5E"
  },
  serviceContainerSort: {
    flexDirection: "row",
    marginVertical: "3.5%",
    alignItems: "center",
    width: "100%"
  },
  serviceContainerSortInput: {
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#D3CDCD",
    alignSelf: "stretch",
    // width: width / 1.2,
    flex: 4,
    height: 50
  },
  serviceGeolocation: {
    marginBottom: "5%"
  },
  // header:{
  //   alignItems:'center',
  //   height: '10%'
  // },
  flatlistContainer: {
    flex: 1
  },
  isTeenContainer: {
    alignItems: "center",
    flexDirection: "row"
  },
  infoContainer: {
    marginTop: "2.5%"
  },
  infoContainerText: {
    fontSize: 12,
    color: "#655E5E",
    textAlign: "left"
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
    height: 60,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#E32E43",
    borderRadius: 5,
    backgroundColor: "#E32E43",
    marginTop: "5%"
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
