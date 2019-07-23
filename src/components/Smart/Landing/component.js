import React from "react";

import { Text, Button, View } from "react-native";

import { connect } from "react-redux";
import { selectLookingFor } from "../../../constants/actions/index.js";

import DummyLanding from "../../../layouts/Landing/component.js";

import { HTTPService } from "../../../utils/HTTPServices/index.js";
import ProgressCircle from "../../Dummy/ProgressCircle/component.js";
import TermsConditions from "../../Dummy/TermsConditions/component.js";

import TeenIcon from "../../Dummy/SVG/TeenIcon/component.js";
import ZendeskChat from "react-native-zendesk-chat";
import DeviceInfo from "react-native-device-info";

mapStateToProps = store => {
  return { db: store.db, ui: store.ui };
};

class SmartLanding extends React.Component {
  constructor() {
    super();
    this.state = { firstTime: false };
  }

  chat = () => {
    ZendeskChat.startChat({
      name: "",
      email: "",
      phone: "user.mobile_phone",
      tags: [""],
      department: ""
    });
  };

  _startDowload = () => {
    this.setState({ firstTime: true }, () => {
      if (this.props.db.places.data.length === 0) HTTPService.fetchPlaces();
      else HTTPService.checkPlaces();
    });
  };

  updateData = () => {
    if (
      !this.state.firstTime &&
      this.props.db.places.data.length !== 0 &&
      !this.props.db.isFetching
    ) {
      HTTPService.checkPlaces();
    }
  };

  _renderComponent = () => {
    console.log("renderComponent");

    let component;

    if (!this.props.db.termsConditions && !this.state.firstTime) {
      component = (
        <TermsConditions
          startDownload={this._startDowload}
          ui={this.props.ui}
          dispatch={this.props.dispatch}
        />
      );
    } else {
      if (this.props.db.isFetching)
        component = (
          <ProgressCircle
            firstFetch={
              this.props.db.places.meta.updatedAt === undefined ? true : false
            }
            downloading={true}
          />
        );
    }

    return (
      <DummyLanding
        navigation={this.props.navigation}
        ui={this.props.ui}
        db={this.props.db}
        dispatch={this.props.dispatch}
        chat={this.chat}
        updateData={this.updateData}
      />
    );
  };

  render() {
    return this._renderComponent();
    // return ((this.props.db.isFetching) ? <ProgressCircle firstFetch={(this.props.db.places.meta.updatedAt === undefined) ? true : false} downloading={true}/> :
    // <DummyLanding
    //   navigation={this.props.navigation}
    //   ui={this.props.ui}
    //   db={this.props.db}
    //   dispatch={this.props.dispatch}
    //   chat={this.chat}
    // />)
  }
}

export default connect(mapStateToProps)(SmartLanding);
