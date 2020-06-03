import React from "react";
import {
  Text,
  StyleSheet,
  View,
  Modal,
  Dimensions,
  Picker,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  PixelRatio
} from "react-native";
import {
  StyleProvider,
  Container,
  Header,
  Content,
  Button,
  Body,
  CheckBox
} from "native-base";
import getTheme from "../../../config/styles/native-base-theme/components";
import platform from "../../../config/styles/native-base-theme/variables/platform";
import I18n from "../../../config/i18n/index.js";
import store from "../../../store/index.js";
import SVGVamosLogo from "../SVG/VamosLogo/component.js";
import {
  setLang,
  setTermsConditions
} from "../../../constants/actions/index.js";

const { width, height } = Dimensions.get("window");

export default class ProgressCircle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      radioButton: 'en-US',
      language: props.ui.lang,
      showModalTermsConditions: true,
      agreeTermsConditions: false
    };
  }

  componentDidMount() {}

  _closeModalTermsConditions = () => {
    this.setState({ showModalTermsConditions: false }, () => {
      this.props.startDownload();
      this.props.dispatch(setTermsConditions());
    });
  };

  selectLanguage = (lang) => {
    this.setState({radioButton: lang})
    this.props.dispatch(setLang(lang));
  }

  render() {
    return (
      <Modal
        animationType={"fade"}
        transparent={true}
        visible={this.state.showModalTermsConditions}
        onRequestClose={() => {}}
      >
        <StyleProvider style={getTheme(platform)}>
          <Container>
            <Header
              androidStatusBarColor="#E6642F"
              style={{ backgroundColor: "#E6642F" }}
            >
              <Body style={{ flex: 1, alignItems: "center" }}>
                <SVGVamosLogo height={140} width={140} />
              </Body>
            </Header>
            <Content
              contentContainerStyle={{
                flex: 1,
                backgroundColor: "#FFFFFF"
              }}
            >
              <View style={styles.modalTermsConditions}>
                <View style={styles.headTermsConditions}>
                  <View style={styles.languageSelector}>
                    <View style={{ marginRight: width / 10 }}>
                      <Text
                        style={{
                          color: "#e6354d",
                          fontFamily: "OpenSans",
                          fontSize: width / 20,
                          fontWeight: "bold"
                        }}
                      >
                        {I18n.t("terms_language", {
                          locale: this.props.ui.lang
                        })}
                      </Text>
                    </View>
                    <View
                      style={{
                        // borderWidth: 2,
                        // borderColor: "#e6334c",
                        width: '40%',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <TouchableOpacity activeOpacity={0.5} onPress={()=>this.selectLanguage('en-US')}>
                        <View style={{flexDirection: 'row', alignItems:'center', marginRight: 50}}>
                          <CheckBox
                          style={{borderRadius: 10}}
                          title='en-US'
                          color={"#e6334c"}
                          checked={this.state.radioButton === 'en-US'}
                          onPress={() => this.selectLanguage('en-US')}
                          ></CheckBox>
                          <Text style={{marginLeft: 20, fontSize: 30}}>EN</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity activeOpacity={0.5} onPress={()=>this.selectLanguage('es-ES')}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <CheckBox
                          style={{borderRadius: 10}}
                          title='es-ES'
                          color={"#e6334c"}
                          checked={this.state.radioButton === 'es-ES'}
                          onPress={() => this.selectLanguage('es-ES')}
                          ></CheckBox>
                          <Text style={{marginLeft: 20, fontSize: 30}}>ES</Text>
                        </View>
                      </TouchableOpacity>

                      
                      {/* <Picker
                        selectedValue={this.state.language}
                        onValueChange={(itemValue, itemIndex) =>
                          this.setState({ language: itemValue }, () => {
                            this.props.dispatch(setLang(itemValue));
                          })
                        }
                      >
                        <Picker.Item
                          label="ES"
                          value={"es-ES"}
                          color="#e6334c"
                        />
                        <Picker.Item
                          label="EN"
                          value={"en-US"}
                          color="#e6334c"
                        />
                      </Picker> */}
                    </View>
                  </View>
                  <View style={styles.titleHeader}>
                    <Text
                      style={{
                        color: "#e6334c",
                        fontFamily: "OpenSans",
                        fontSize: width / 25
                      }}
                    >
                      {I18n.t("terms_title", { locale: this.props.ui.lang })}
                    </Text>
                  </View>
                </View>
                <ScrollView
                  style={{ width: "100%" }}
                  contentContainerStyle={{
                    alignItems: "center",
                    paddingHorizontal: width / 20
                  }}
                  keyboardShouldPersistTaps="handled"
                >
                  <View style={styles.bodyTermsConditions}>
                    <Text
                      style={{
                        color: "#6a6a6d",
                        fontFamily: "OpenSans",
                        fontSize: width / 30
                      }}
                    >
                      {I18n.t("terms_conditions", {
                        locale: this.props.ui.lang
                      })}
                    </Text>
                  </View>
                </ScrollView>
                <View style={styles.footerTermsConditions}>
                  <View
                    style={{
                      marginTop: "5%",
                      marginBottom: "2.5%",
                      height: height / 15
                    }}
                  >
                    <TouchableHighlight
                      onPress={() =>
                        this.setState({
                          agreeTermsConditions: !this.state.agreeTermsConditions
                        })
                      }
                      activeOpacity={0.5}
                      underlayColor="#e6334c"
                      style={{ marginTop: "2.5%", height: 35, justifyContent: 'center'}}
                    >
                      <View style={{ flexDirection: "row", alignItems: 'center' }}>
                        <CheckBox
                          onPress={() =>
                            this.setState({
                              agreeTermsConditions: !this.state
                                .agreeTermsConditions
                            })
                          }
                          checked={this.state.agreeTermsConditions}
                          color={"#e6334c"}
                        />
                        <View style={{ marginLeft: width / 15, flex: 1 }}>
                          <Text
                            style={{
                              color: "#e6334c",
                              fontFamily: "OpenSans",
                              fontSize: PixelRatio.get() > 1.8 ? width /28 : width / 22
                            }}
                          >
                            {I18n.t("terms_agree", {
                              locale: this.props.ui.lang
                            })}
                          </Text>
                        </View>
                      </View>
                    </TouchableHighlight>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      marginBottom: "5%",
                      paddingBottom: "2.5%",
                      height: height / 15
                    }}
                  >
                    <Button
                      bordered
                      disabled={!this.state.agreeTermsConditions}
                      style={{
                        borderColor: "#D3CDCD",
                        elevation: 2,
                        flex: 1,
                        alignSelf: "center",
                        backgroundColor: this.state.agreeTermsConditions
                          ? "#FFFFFF"
                          : "#D3CDCD"
                      }}
                      onPress={() => this._closeModalTermsConditions()}
                    >
                      <Text
                        style={{
                          color: "#e6334c",
                          flexWrap: "wrap",
                          fontFamily: "OpenSans",
                          fontSize: width / 20,
                          fontWeight: "bold"
                        }}
                      >
                        {I18n.t("terms_button", { locale: this.props.ui.lang })}
                      </Text>
                    </Button>
                  </View>
                </View>
              </View>
            </Content>
          </Container>
        </StyleProvider>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalTermsConditions: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    width: "100%"
  },
  headTermsConditions: {
    width: "100%",
    paddingHorizontal: width / 20
  },
  bodyTermsConditions: {
    width: "100%",
    borderWidth: 3,
    borderColor: "#6a6a6d",
    padding: "2.5%"
  },
  footerTermsConditions: {
    paddingHorizontal: width / 20,
    width: "100%"
  },
  languageSelector: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: "5%",
    paddingBottom: "4.5%",
    borderBottomWidth: 4,
    borderBottomColor: "#e6334c"
  },
  titleHeader: {
    marginTop: "2.5%",
    marginBottom: "5%"
  }
});
