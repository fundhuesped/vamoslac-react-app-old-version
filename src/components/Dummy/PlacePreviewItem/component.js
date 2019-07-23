import React from "react";
import {
  Text,
  TouchableHighlight,
  StyleSheet,
  View,
  Image,
  Dimensions
} from "react-native";
import { Icon } from "native-base";
import I18n from "../../../config/i18n/index.js";

import SVGCondomIcon from "../SVG/CondomIcon/component.js";
import SVGCondomFriendlyIcon from "../SVG/CondomFriendlyIcon/component.js";
import SVGDetectionIcon from "../SVG/DetectionIcon/component.js";
import SVGDetectionFriendlyIcon from "../SVG/DetectionFriendlyIcon/component.js";
import SVGHealthIcon from "../SVG/HealthIcon/component.js";
import SVGHealthFriendlyIcon from "../SVG/HealthFriendlyIcon/component.js";
import SVGILEIcon from "../SVG/ILEIcon/component.js";
import SVGILEFriendlyIcon from "../SVG/ILEFriendlyIcon/component.js";
import SVGMACIcon from "../SVG/MACIcon/component.js";
import SVGMACFriendlyIcon from "../SVG/MACFriendlyIcon/component.js";
import SVGVIHIcon from "../SVG/VIHIcon/component.js";
import SVGVIHFriendlyIcon from "../SVG/VIHFriendlyIcon/component.js";
import SVGVIHQuickIcon from "../SVG/VIHQuickIcon/component.js";

import store from "../../../store/index.js";

const { width } = Dimensions.get("window");

export default class PlacePreviewItem extends React.PureComponent {
  _onPress = () => {
    this.props.navigation.navigate(
      "Establishment",
      { establishmentData: this.props.data },
      () => {
        this.props.onPressItem(this.props.id);
      }
    );
  };

  _renderServices = () => {
    let iconsArray = [];
    let services = this.props.data.placeData;
    if (services.condones) {
      let svg = services.friendly_condones ? (
        <SVGCondomFriendlyIcon key={0} height={width / 12} width={width / 12} />
      ) : (
        <SVGCondomIcon key={0} height={width / 12} width={width / 12} />
      );
      iconsArray.push(svg);
    }
    if (services.dc) {
      let svg = services.friendly_dc ? (
        <SVGDetectionFriendlyIcon
          key={1}
          height={width / 12}
          width={width / 12}
        />
      ) : (
        <SVGDetectionIcon key={1} height={width / 12} width={width / 12} />
      );
      iconsArray.push(svg);
    }
    if (services.ile) {
      let svg = services.friendly_ile ? (
        <SVGILEFriendlyIcon key={2} height={width / 12} width={width / 12} />
      ) : (
        <SVGILEIcon key={2} height={width / 12} width={width / 12} />
      );
      iconsArray.push(svg);
    }
    if (services.mac) {
      let svg = services.friendly_mac ? (
        <SVGMACFriendlyIcon key={3} height={width / 12} width={width / 12} />
      ) : (
        <SVGMACIcon key={3} height={width / 12} width={width / 12} />
      );
      iconsArray.push(svg);
    }
    if (services.ssr) {
      let svg = services.friendly_ssr ? (
        <SVGHealthFriendlyIcon key={4} height={width / 12} width={width / 12} />
      ) : (
        <SVGHealthIcon key={4} height={width / 12} width={width / 12} />
      );
      iconsArray.push(svg);
    }
    if (services.prueba) {
      let svg = services.friendly_prueba ? (
        <SVGVIHFriendlyIcon key={5} height={width / 12} width={width / 12} />
      ) : (
        <SVGVIHIcon key={5} height={width / 12} width={width / 12} />
      );
      iconsArray.push(svg);
    }
    if (services.prueba && services.es_rapido) {
      let svg = (
        <SVGVIHQuickIcon key={6} height={width / 12} width={width / 12} />
      );
      iconsArray.push(svg);
    }

    return iconsArray;
  };

  _renderEvaluation = () => {
    return this.props.data.placeData.rateReal !== 0 ? (
      <View>
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
            flexWrap: "wrap"
          }}
        >
          {Math.round(this.props.data.placeData.rateReal * 10) / 10}
        </Text>
        {Math.round(this.props.data.placeData.rateReal * 10) / 10 !== 1 ? (
          <Text style={{ color: "#FFFFFF", fontSize: 8, flexWrap: "wrap" }}>
            {I18n.t("point_plural", { locale: store.getState().ui.lang })}
          </Text>
        ) : (
          <Text style={{ color: "#FFFFFF", fontSize: 8, flexWrap: "wrap" }}>
            {I18n.t("point_singular", { locale: store.getState().ui.lang })}
          </Text>
        )}
      </View>
    ) : (
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 10,
          textAlign: "center",
          flexWrap: "wrap"
        }}
      >
        {I18n.t("without_evaluations", { locale: store.getState().ui.lang })}
      </Text>
    );
  };

  render() {
    return (
      <TouchableHighlight
        onPress={this._onPress}
        style={{
          borderColor: "rgba(0, 0, 0, 0)",
          elevation: 2,
          borderRadius: 5,
          marginBottom: 3
        }}
        activeOpacity={0.5}
        underlayColor="white"
      >
        <View style={{ flexDirection: "row" }}>
          <View style={styles.placePreviewContainer}>
            <View
              style={[
                styles.placePreviewHeader,
                styles.rowAlign,
                styles.marginSeparator
              ]}
            >
              <Text
                style={[styles.fontColor, { fontWeight: "bold", fontSize: 16 }]}
                numberOfLines={1}
              >
                {this.props.data.placeData.establecimiento}
              </Text>
            </View>
            <View style={styles.placePreviewBody}>
              <View style={[styles.bodyLocation, styles.marginSeparator]}>
                <View style={[styles.bodyLocationAddress, styles.rowAlign]}>
                  <Icon
                    name="ios-pin"
                    style={{
                      fontSize: 14,
                      marginRight: "2%",
                      color: "#655E5E"
                    }}
                  />
                  {this.props.data.placeData.cruce !== "" ? (
                    <Text
                      numberOfLines={1}
                      style={[styles.subtitle, styles.fontColor]}
                    >
                      {I18n.t("direcion_position_label", {
                        calle: this.props.data.placeData.calle,
                        altura: this.props.data.placeData.altura,
                        piso: this.props.data.placeData.piso_dpto,
                        interseccion: this.props.data.placeData.cruce,
                        locale: store.getState().ui.lang
                      })}
                    </Text>
                  ) : (
                    <Text
                      numberOfLines={1}
                      style={[styles.subtitle, styles.fontColor]}
                    >{`${this.props.data.placeData.calle} ${
                      this.props.data.placeData.altura
                    } ${this.props.data.placeData.piso_dpto}`}</Text>
                  )}
                </View>
                {this.props.data.distance !== undefined ? (
                  <View style={[styles.bodyLocationDistance, styles.rowAlign]}>
                    <Icon
                      name="ios-walk"
                      style={{
                        fontSize: 14,
                        marginRight: "2%",
                        color: "#655E5E"
                      }}
                    />
                    <Text style={[styles.subtitle, styles.fontColor]}>
                      {I18n.t("place_distance_size", {
                        distance: parseInt(this.props.data.distance * 1000),
                        locale: store.getState().ui.lang
                      })}
                    </Text>
                  </View>
                ) : null}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%"
                }}
              >
                <View
                  style={[
                    styles.bodyCategories,
                    styles.rowAlign,
                    styles.marginSeparator
                  ]}
                >
                  {this._renderServices()}
                </View>
                <View style={styles.evaluationsContainer}>
                  {this._renderEvaluation()}
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#e6334c",
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5
            }}
          >
            <Icon name="ios-play" style={{ fontSize: 30, color: "#FFFFFF" }} />
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  placePreviewContainer: {
    // borderWidth: 1,
    // borderColor: "#",
    paddingLeft: "5%",
    paddingRight: "2.5%",
    paddingVertical: "5%",
    flex: 9,
    height: width / 2.7
  },
  fontColor: { color: "#655E5E" },
  rowAlign: {
    flexDirection: "row",
    alignItems: "center"
  },
  marginSeparator: {
    marginBottom: "2.5%"
  },
  evaluationsContainer: {
    backgroundColor: "#e6334c",
    marginLeft: "auto",
    width: 70,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: "1%",
    height: 40
  },
  placePreviewHeader: {},
  placePreviewBody: {
    // backgroundColor: 'blue'
  },
  bodyLocation: {},
  bodyLocationAddress: {},
  bodyCategories: {
    width: "80%",
    flexWrap: "wrap"
  },
  subtitle: {
    fontSize: 14
  },
  iconLogo: {
    width: 30,
    height: 30,
    marginRight: "2.5%"
  }
});
