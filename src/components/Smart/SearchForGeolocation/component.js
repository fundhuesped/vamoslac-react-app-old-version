import React from "react";

import { Text, Button, View } from "react-native";

import { connect } from "react-redux";

import DummySearchForGeolocation from "../../../layouts/SearchForGeolocation/component.js";

import { selectSearchEngine } from "../../../constants/actions/index.js";
import {
  DISTANCE,
  RATE,
  TEEN,
  AUTOCOMPLETE
} from "../../../constants/action-types/index.js";

import ProgressCircle from "../../Dummy/ProgressCircle/component.js";

import { Engine } from "../../../utils/engines";

import { tracker } from "../../../utils/analytics/index.js";

import ZendeskChat from "react-native-zendesk-chat";
import DeviceInfo from "react-native-device-info";

function mapStateToProps(store) {
  return { db: store.db, ui: store.ui };
}

class SmartSearchForGeolocation extends React.Component {
  componentDidMount = () => {
    this.Engine = new Engine(
      this.props.db.places.data,
      this.props.ui.lookingFor
    );
    this.Engine.sortEngine("RATE");
  };

  _changeSortValue = (sortEngine, value) => {
    if (sortEngine === TEEN) this.Engine.sortEngine(sortEngine, value);
    else this.Engine.sortEngine(sortEngine);
  };

  // componentWillUnmount = () => this.Engine.cleanResultList()

  chat = () => {
    let lookingFor = this.props.ui.lookingFor ? this.props.ui.lookingFor : "",
      country = this.props.navigation.state.params.country
        ? this.props.navigation.state.params.country
        : "",
      cityDepartment = this.props.navigation.state.params.cityDepartment
        ? this.props.navigation.state.params.cityDepartment
        : "";
    ZendeskChat.startChat({
      name: "",
      email: "",
      phone: "user.mobile_phone",
      tags: [`${lookingFor}`, `${country}`, `${cityDepartment}`],
      department: `${lookingFor} ${country} ${cityDepartment}`
    });
  };

  render() {
    let data = this.props.ui.resultList;
    let event = "listado_" + this.props.ui.lookingFor;
    tracker.trackEvent(event, this.props.navigation.state.params.country);
    return true ? (
      <DummySearchForGeolocation
        navigation={this.props.navigation}
        store={data}
        _changeSortValue={this._changeSortValue}
        address={this.props.navigation.state.params.cityDepartment}
        serviceTypeData={this.props.ui.lookingFor}
        lang={this.props.ui.lang}
        searchEngine={
          this.props.ui.searchEngine.selected.name !== AUTOCOMPLETE
            ? true
            : false
        }
        chat={this.chat}
      />
    ) : (
      <ProgressCircle />
    );
  }
}

export default connect(mapStateToProps)(SmartSearchForGeolocation);
