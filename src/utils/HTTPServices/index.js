import store from "../../store/index.js";

import {
  updatePlaces,
  updateCities,
  startFetching
} from "../../constants/actions/index.js";
import {
  DAYSBEFOREUPDATE,
  URLPLACES,
  URLCITIES,
  URL
} from "../../config/HTTP/index.js";
import Reactotron from "reactotron-react-native";

export class HTTPServices {
  constructor() {
    this.currentPage = 1;
    this.currentDataPlaces = {};
    this.currentDataCities = {};
    this.failedPages = {};
    this.totalPages = 1;
    this.nextUrl = URLPLACES;
    this.totalEstablishment = 0;
    this.to = 1;
    this.cityOrPlace = "place";
  }

  fetchPlaces = async () => {
    Reactotron.log('EJETUCA EL REPLACEEEEE')
    store.dispatch(startFetching());
    while (this.currentPage) {
      if (this.currentPage <= this.totalPages) {
        try {
          let response = await fetch(this.nextUrl, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            }
          });
          let responseJson = await response.json();

          this.totalEstablishment = responseJson.total;
          this.nextUrl = `${URLPLACES}/?page=${responseJson.current_page + 1}`;
          // if(this.currentPage % 5 === 0) throw new Error('error')
          this.currentDataPlaces[responseJson.current_page.toString()] =
            responseJson.data;
          this.totalPages = responseJson.last_page;
          this.currentPage = responseJson.current_page;
          this.to = responseJson.to;
          if (this.totalPages === this.currentPage) this.currentPage += 1;
        } catch (error) {
          this.nextUrl = `${URLPLACES}/?page=${this.currentPage + 1}`;
          this.currentPage = this.currentPage + 1;
        }
      } else {
        // alert(`termino de fetchear ${responseJson.last_page} paginas => ${responseJson.total} lugares`)
        this.currentPage = 0;
      }
    }
    this.fetchCities();
  };

  checkPlaces = async () => {
    const lastUpdate = new Date(store.getState().db.places.meta.updatedAt);
    const currentDate = new Date();
    const differenceMiliseconds = currentDate.getTime() - lastUpdate.getTime();
    const differenceDays = differenceMiliseconds / 1000 / 60 / 60 / 24;

    if (differenceDays >= DAYSBEFOREUPDATE) {
      this.fetchPlaces();
    } else {
      let failedPages = store.getState().db.places.meta.failedPages;
      const newFailedPages = {};
      for (let i in failedPages) {
        let nextUrl = `${URL}/api/v2/places/getall/?page=${i}`;
        try {
          let response = await fetch(nextUrl, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            }
          });
          let responseJson = await response.json();
          // if(currentPage % 5 === 0) throw new Error('error')
          failedPages[i.toString()] = responseJson.data;
        } catch (error) {
          newFailedPages[i.toString()] = null;
        }
      }
      if (Object.keys(failedPages).length !== 0)
        this.fetchCities({
          currentDataPlaces: failedPages,
          failedPages: newFailedPages
        });
    }
  };

  fetchCities = async places => {
    this.cityOrPlace = "city";

    if (places !== undefined && places !== null) {
      if (!store.getState().db.cities.length) {
        try {
          let response = await fetch(URLCITIES, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            }
          });
          let responseJson = await response.json();
          this.currentDataCities = responseJson;
        } catch (error) {
          // alert('error fetching cities'+error.message)
        }
      } else this.currentDataCities = store.getState().db.cities;

      store.dispatch(
        updatePlaces(places.currentDataPlaces, places.failedPages)
      );
      store.dispatch(updateCities(this.currentDataCities));
    } else {
      try {
        let response = await fetch(URLCITIES, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        });
        let responseJson = await response.json();
        this.currentDataCities = responseJson;
      } catch (error) {
        // alert('error fetching cities'+error.message)
      }

      store.dispatch(updatePlaces(this.currentDataPlaces, this.failedPages));
      store.dispatch(updateCities(this.currentDataCities));
    }
  };

  getCurrentPage = () => {
    return {
      currentPlaces: this.to,
      totalEstablishment: this.totalEstablishment,
      cityOrPlace: this.cityOrPlace
    };
  };

  cleanState = () => {
    Reactotron.log('SE EJECUTA CLEANnnnnn')
    this.currentPage = 1;
    this.currentDataPlaces = {};
    this.currentDataCities = {};
    this.failedPages = {};
    this.totalPages = 1;
    this.nextUrl = URLPLACES;
    this.totalEstablishment = 0;
    this.to = 1;
    this.cityOrPlace = "place";
  };
}

export let HTTPService = new HTTPServices();
