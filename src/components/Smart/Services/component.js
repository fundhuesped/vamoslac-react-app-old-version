import React from "react";

import { connect } from "react-redux";
import { updatePlaces } from "../../../constants/actions/index.js";

import DummyServices from "../../../layouts/Services/component.js";

import { getServiceData } from "../../../utils/engines/index.js";

import { tracker } from "../../../utils/analytics/index.js";

import {
  CON,
  VIH,
  SSR,
  MAC,
  LPI,
  DC,
  TEEN
} from "../../../constants/action-types";

import ZendeskChat from "react-native-zendesk-chat";
import DeviceInfo from "react-native-device-info";

function mapStateToProps(store) {
  return { db: store.db, ui: store.ui };
}

class SmartServices extends React.Component {
  componentDidMount = () => {};

  chat = () => {
    let lookingFor = this.props.ui.lookingFor ? this.props.ui.lookingFor : "";
    ZendeskChat.startChat({
      name: "",
      email: "",
      phone: "user.mobile_phone",
      tags: [`${lookingFor}`],
      department: `${lookingFor}`
    });
  };

  render() {
    tracker.trackEvent("servicio", this.props.ui.lookingFor);
    return (
      <DummyServices
        navigation={this.props.navigation}
        serviceTypeData={
          this.props.ui.lookingFor ===
          this.props.navigation.state.params.service
            ? this.props.ui.lookingFor
            : CON
        }
        db={this.props.db}
        ui={this.props.ui}
        dispatch={this.props.dispatch}
        cleanState={this.props.navigation.state.params.cleanState}
        chat={this.chat}
      />
    );
  }
}

export default connect(mapStateToProps)(SmartServices);
