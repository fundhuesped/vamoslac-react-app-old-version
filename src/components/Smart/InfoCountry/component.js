import React from "react";
import DummyInfoCountry from "../../../layouts/InfoCountry/component.js";
import ProgressCircle from "../../Dummy/ProgressCircle/component.js";
import { connect } from "react-redux";

function mapStateToProps(store) {
  return { ui: store.ui };
}

class SmartInfoCountry extends React.Component {
  constructor() {
    super();
    this.state = { loaded: false, country: "", address: "" };
  }

  componentDidMount = () => this._getCountry();

  _getCountry = () => {
    let country,
      cityDepartment = this.props.navigation.state.params.cityDepartment;

    if (cityDepartment !== undefined) {
      if (cityDepartment.nombre_pais === "Antigua and Barbuda") country = "AG";
      if (cityDepartment.nombre_pais === "Argentina") country = "AR";
      if (cityDepartment.nombre_pais === "Aruba") country = "AW";
      if (cityDepartment.nombre_pais === "Barbados") country = "BB";
      if (cityDepartment.nombre_pais === "Belize") country = "BZ";
      if (cityDepartment.nombre_pais === "Bolivia") country = "BO";
      if (cityDepartment.nombre_pais === "Chile") country = "CL";
      if (cityDepartment.nombre_pais === "Colombia") country = "CO";
      if (cityDepartment.nombre_pais === "Curacao") country = "CW";
      if (cityDepartment.nombre_pais === "Dominica") country = "DM";
      if (cityDepartment.nombre_pais === "Ecuador") country = "EC";
      if (cityDepartment.nombre_pais === "El Salvador") country = "SV";
      if (cityDepartment.nombre_pais === "Grenada") country = "GD";
      if (cityDepartment.nombre_pais === "Guatemala") country = "GT";
      if (cityDepartment.nombre_pais === "Guyana") country = "GY";
      if (
        cityDepartment.nombre_pais === "Haiti" ||
        cityDepartment.nombre_pais === "Haití"
      )
        country = "HT";
      if (cityDepartment.nombre_pais === "Honduras") country = "HN";
      if (cityDepartment.nombre_pais === "Jamaica") country = "JM";
      if (cityDepartment.nombre_pais === "México") country = "MX";
      if (cityDepartment.nombre_pais === "Panamá") country = "PA";
      if (cityDepartment.nombre_pais === "Paraguay") country = "PY";
      if (cityDepartment.nombre_pais === "Perú") country = "PE";
      if (cityDepartment.nombre_pais === "Puerto Rico") country = "PR";
      if (cityDepartment.nombre_pais === "República Dominicana") country = "DO";
      if (cityDepartment.nombre_pais === "Saint Vincent") country = "VC";
      if (cityDepartment.nombre_pais === "Saint Lucia") country = "LC";
      if (cityDepartment.nombre_pais === "Suriname") country = "SR";
      if (cityDepartment.nombre_pais === "Trinidad and Tobago") country = "TT";
      if (cityDepartment.nombre_pais === "Uruguay") country = "UY";
      if (cityDepartment.nombre_pais === "Venezuela") country = "VE";

      this.setState({ country: country, loaded: true });
    } else {
      this.setState({
        country: this.props.navigation.state.params.country
          ? this.props.navigation.state.params.country
          : "",
        loaded: true,
        address: this.props.navigation.state.params.address
      });
    }
  };

  render() {
    return this.state.loaded ? (
      <DummyInfoCountry
        country={this.state.country}
        service={this.props.ui.lookingFor}
        navigation={this.props.navigation}
        address={this.state.address}
        coords={this.props.navigation.state.params.coords}
        cityDepartment={this.props.navigation.state.params.cityDepartment}
        lang={this.props.ui.lang}
      />
    ) : (
      <ProgressCircle downloading={false} />
    );
  }
}

export default connect(mapStateToProps)(SmartInfoCountry);
