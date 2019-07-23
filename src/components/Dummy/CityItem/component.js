import React from "react";
import {
  Text,
  TouchableHighlight,
  StyleSheet,
  View,
  Image
} from "react-native";
import { Icon } from "native-base";

export default class CityItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.data);
  };

  _renderLabel = () => {
    let label,
      cityString =
        this.props.data.nombre_ciudad !== undefined &&
        this.props.data.nombre_ciudad !== null &&
        this.props.data.nombre_ciudad !== ""
          ? `${this.props.data.nombre_ciudad},`
          : "",
      departmentString =
        this.props.data.nombre_partido !== undefined &&
        this.props.data.nombre_partido !== null &&
        this.props.data.nombre_partido !== ""
          ? `${this.props.data.nombre_partido},`
          : "",
      provinceString =
        this.props.data.nombre_provincia !== undefined &&
        this.props.data.nombre_provincia !== null &&
        this.props.data.nombre_provincia !== ""
          ? `${this.props.data.nombre_provincia},`
          : "",
      countryString =
        this.props.data.nombre_pais !== undefined &&
        this.props.data.nombre_pais !== null &&
        this.props.data.nombre_pais !== ""
          ? this.props.data.nombre_pais
          : "";

    label = `${cityString} ${departmentString} ${provinceString} ${countryString}`;

    return label;
  };

  render() {
    return (
      <Text onPress={this._onPress}>{this._renderLabel()}</Text>
      // <SomeOtherWidget
      //   {...this.props}
      //   onPress={this._onPress}
      // />
    );
  }
}
