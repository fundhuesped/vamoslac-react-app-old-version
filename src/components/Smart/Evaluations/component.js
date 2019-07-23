import React from "react";

import { Text, Button, View } from "react-native";

import { connect } from "react-redux";
import { selectLookingFor, setLang } from "../../../constants/actions/index.js";

import DummyEvaluations from "../../../layouts/Evaluations/component.js";

import I18n from "../../../config/i18n/index.js";
import {
  _fetchPlaces,
  _checkPlaces
} from "../../../utils/HTTPServices/index.js";
import ProgressCircle from "../../Dummy/ProgressCircle/component.js";

import { tracker } from "../../../utils/analytics/index.js";

function mapStateToProps(store) {
  return { db: store.db, ui: store.ui };
}

class Evaluations extends React.Component {
  render() {
    let event =
      this.props.navigation.state.params.establishment.establecimiento +
      " " +
      this.props.navigation.state.params.establishment.placeId;
    tracker.trackEvent("evaluando", event);
    return (
      <DummyEvaluations
        navigation={this.props.navigation}
        servicesAvailable={this.props.navigation.state.params.servicesAvailable}
        establishmentId={
          this.props.navigation.state.params.establishment.placeId
        }
        lang={this.props.ui.lang}
        reRenderFunction={this.props.navigation.state.params.reRenderFunction}
        cleanState={this.props.navigation.state.params.cleanState}
      />
    );
  }
}

export default connect(mapStateToProps)(Evaluations);
