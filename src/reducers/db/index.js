import {
  normalizeBoolean,
  normalizePlace,
  normalizePlacesList,
  normalizeAndInsertEvaluationsList
} from "../../utils/normalizers";

import {
  UPDATE_PLACES,
  UPDATE_COUNTRIES,
  UPDATE_PROVINCES,
  UPDATE_CITIES,
  UPDATE_EVALUATIONS,
  FETCHING,
  UPDATE_STORE_DB,
  SET_TERMS_CONDITIONS
} from "../../constants/action-types";

import { _updateStore, _getStore } from "../../storage";

const initialState = {
  termsConditions: false,
  isFetching: false,
  places: {
    meta: {
      updatedAt: undefined,
      failedPages: []
    },
    data: []
  },
  countries: [],
  procinces: [],
  cities: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PLACES: {
      let data = normalizePlacesList(action.places);
      if (data.length !== 0) {
        let storeRealm = _getStore("1");
        _updateStore(storeRealm, data, "places");
      }
      let currentData = state.places.data ? { ...state.places.data } : {};
      let store = Object.assign({}, state, {
        isFetching: true,
        places: {
          meta: {
            updatedAt: new Date(),
            failedPages: action.failedPages
          },
          data: Object.assign({}, currentData, { ...data })
        }
      });
      return store;
      break;
    }
    case UPDATE_COUNTRIES: {
      let countries = action.countries.map(country => {
        return {
          id: country.id,
          name: country.nombre_pais,
          zoom: country.zoom
        };
      });
      return Object.assign(state, {
        countries
      });
      break;
    }
    case UPDATE_PROVINCES: {
      let provinces = action.provinces.map(province => {
        return {
          id: province.id,
          name: province.nombre_provincia
        };
      });
      return Object.assign(state, {
        provinces
      });
      break;
    }
    case UPDATE_CITIES: {
      let cities = action.cities.map((city, i) => {
        let id;
        if (city.idObject === undefined)
          id = city.id !== null && city.id !== undefined ? city.id : 0;
        else
          id =
            city.idObject !== null && city.idObject !== undefined
              ? city.idObject
              : 0;

        let nombre_ciudad =
          city.nombre_ciudad !== null && city.nombre_ciudad !== undefined
            ? city.nombre_ciudad
            : "";
        let idPartido =
          city.idPartido !== null && city.idPartido !== undefined
            ? city.idPartido
            : 0;
        let nombre_partido =
          city.nombre_partido !== null && city.nombre_partido !== undefined
            ? city.nombre_partido
            : "";
        let idProvincia =
          city.idProvincia !== null && city.idProvincia !== undefined
            ? city.idProvincia
            : 0;
        let nombre_provincia =
          city.nombre_provincia !== null && city.nombre_provincia !== undefined
            ? city.nombre_provincia
            : "";
        let idPais =
          city.idPais !== null && city.idPais !== undefined ? city.idPais : 0;
        let nombre_pais =
          city.nombre_pais !== null && city.nombre_pais !== undefined
            ? city.nombre_pais
            : "";
        return {
          id: i,
          idObject: id,
          nombre_ciudad: nombre_ciudad,
          idPartido: idPartido,
          nombre_partido: nombre_partido,
          idProvincia: idProvincia,
          nombre_provincia: nombre_provincia,
          idPais: idPais,
          nombre_pais: nombre_pais
        };
      });

      if (cities.length !== 0) {
        let storeRealm = _getStore("1");
        _updateStore(storeRealm, cities, "cities");
      }
      let currentCities = state.cities.length ? state.cities : cities;
      let store = {
        ...state,
        isFetching: false,
        cities: currentCities
      };
      return store;
      break;
    }
    case UPDATE_EVALUATIONS: {
      return Object.assign(state, {
        places: {
          data: normalizeAndInsertEvaluationsList(
            state.places,
            action.evaluations
          )
        }
      });
      break;
    }
    case FETCHING: {
      return { ...state, isFetching: true };
      break;
    }
    case SET_TERMS_CONDITIONS: {
      let storeRealm = _getStore("1");
      _updateStore(storeRealm, true, "termsConditions");
      return { ...state, termsConditions: true };
      break;
    }
    case UPDATE_STORE_DB: {
      // return Object.assign(state, {
      //   ...state,
      //   isFetching: false,
      //   places: {
      //     ...state.places,
      //     data: action.store
      //   }
      // })
      let store = {
        ...state,
        isFetching: false,
        termsConditions: action.store.termsConditions,
        places: {
          meta: {
            ...state.places.meta,
            updatedAt: action.store.createdTimestamp
          },
          data: action.store.places
        },
        cities: action.store.cities
      };
      // alert('store reducer '+ store.places.data.length);
      return store;
      break;
    }

    default:
      return state;
  }
  return state;
};
