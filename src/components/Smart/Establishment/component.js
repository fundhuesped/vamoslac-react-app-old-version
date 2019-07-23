import React from "react";

import { Text, Button, View } from "react-native";

import { connect } from "react-redux";
import { selectLookingFor, setLang } from "../../../constants/actions/index.js";
import { URL } from "../../../config/HTTP/index.js";
import DummyEstablishment from "../../../layouts/Establishment/component.js";

import I18n from "../../../config/i18n/index.js";
import {
  _fetchPlaces,
  _checkPlaces
} from "../../../utils/HTTPServices/index.js";
import ProgressCircle from "../../Dummy/ProgressCircle/component.js";

function mapStateToProps(store) {
  return { db: store.db, ui: store.ui };
}

class Establishment extends React.Component {
  constructor() {
    super();
    this.state = {
      comments: null,
      services: null,
      averageVote: null
    };
  }

  componentDidMount = () => {
    this._getEstablishment();
  };

  _reRenderComponent = () => {
    this.setState({ comments: null, services: null });
    this._getEstablishment();
  };

  _getEstablishment = async () => {
    let urlComments = `${URL}/api/v2/evaluacion/comentarios/${
      this.props.navigation.state.params.establishmentData.placeData.placeId
    }`;
    try {
      let responseComments = await fetch(urlComments);
      let responseCommentsJson = await responseComments.json();
      let urlServices = `${URL}/api/v2/service/getPlaceServices/${
        this.props.navigation.state.params.establishmentData.placeData.placeId
      }`;
      try {
        let responseServices = await fetch(urlServices);
        let responseServicesJson = await responseServices.json();
        let services = [];
        responseServicesJson.map((service, index) => {
          services.push({
            title: service.shortname,
            content: {
              id: service.id,
              name: service.name,
              shortname: service.shortname
            }
          });
        });
        let urlAverageVote = `${URL}/api/v2/evaluacion/promedio/${
          this.props.navigation.state.params.establishmentData.placeData.placeId
        }`;
        try {
          let responseAverageVote = await fetch(urlAverageVote);
          let responseAverageVoteJson = await responseAverageVote.json();
          this.setState({
            services: services,
            comments: responseCommentsJson,
            averageVote: responseAverageVoteJson
          });
        } catch (error) {
          this.setState({ services: [], comments: [] });
        }
      } catch (error) {
        // alert('services error'+" "+error+" "+error.message);
        this.setState({ services: [], comments: [] });
      }
    } catch (error) {
      // alert('comments error'+" "+error+" "+error.message);
      this.setState({ services: [], comments: [] });
    }
  };

  render() {
    return this.state.comments !== null && this.state.services !== null ? (
      <DummyEstablishment
        servicesAvailable={this.state.services}
        commentsAvailable={this.state.comments}
        averageVote={this.state.averageVote}
        navigation={this.props.navigation}
        establishmentData={this.props.navigation.state.params.establishmentData}
        lang={this.props.ui.lang}
        lookingFor={this.props.ui.lookingFor}
        reRenderFunction={this._reRenderComponent}
      />
    ) : (
      <ProgressCircle downloading={false} />
    );
  }
}

export default connect(mapStateToProps)(Establishment);
