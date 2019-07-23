import {
  CON,
  AUTOCOMPLETE,
  GEOLOCATE,
  TEEN,
  RATE,
  DISTANCE,
  SELECT_LOOKING_FOR,
  SELECT_SORT_ENGINE,
  SELECT_SEARCH_ENGINE,
  SET_RESULT_LIST,
  SET_LANG,
  SET_COUNTRY,
  SET_CURRENT_LOCATION,
  EN,
  DEFAULT,
  UPDATE_STORE_UI
} from "../../constants/action-types";

import { SearchEngine, SortEngine } from "../../utils/engines";

import {
  availiableServices,
  availiableCountries,
  availiableLangs,
  availiableSortEngines,
  availiableSearchEngines
} from "../../utils/validators";

import { _updateStore, _getStore } from "../../storage";

const initialState = {
  lang: EN,
  country: DEFAULT,
  lookingFor: CON,
  sortEngine: {
    selected: {
      name: DISTANCE
    }
  },
  searchEngine: {
    selected: {
      name: GEOLOCATE
    },
    userInput: {
      GEOLOCATE: {
        timeStamp: undefined,
        currentLocation: {
          latitude: null,
          longitude: null
        }
      },
      AUTOCOMPLETE: {
        currentDataInput: ""
      }
    }
  },
  resultList: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SELECT_LOOKING_FOR: {
      let lookingFor = String(action.lookingFor);

      if (availiableServices.indexOf(lookingFor) === -1) return state;
      else return { ...state, lookingFor: lookingFor };

      break;
    }
    case SELECT_SORT_ENGINE: {
      let selected = String(action.sortEngine);

      if (availiableSortEngines.indexOf(selected) === -1) return state;

      let _state;

      if (selected === RATE) {
        _state = Object.assign({}, state, {
          sortEngine: {
            selected: RATE,
            engine: SortEngine.rate
          }
        });
      } else if (selected === DISTANCE) {
        _state = Object.assign({}, state, {
          sortEngine: {
            selected: DISTANCE,
            engine: SortEngine.distance
          }
        });
      }

      return _state;

      break;
    }
    case SELECT_SEARCH_ENGINE: {
      let selected = String(action.searchEngine);

      if (availiableSearchEngines.indexOf(selected) === -1) return state;

      let _state;
      if (selected === AUTOCOMPLETE) {
        _state = {
          ...state,
          searchEngine: {
            ...state.searchEngine,
            selected: {
              name: AUTOCOMPLETE
            }
          }
        };
      } else if (selected === GEOLOCATE) {
        _state = {
          ...state,
          searchEngine: {
            ...state.searchEngine,
            selected: {
              name: GEOLOCATE
            }
          }
        };
      } else if (selected === TEEN) {
        _state = {
          ...state,
          searchEngine: {
            ...state.searchEngine,
            selected: {
              name: TEEN
            }
          }
        };
      }
      return _state;

      break;
    }
    case SET_RESULT_LIST: {
      return {
        ...state,
        resultList: action.resultList
      };
      break;
    }

    case SET_LANG: {
      let lang = String(action.lang);
      if (availiableLangs.indexOf(lang) === -1) {
        let storeRealm = _getStore("1");
        _updateStore(storeRealm, "en-US", "lang");
        return state;
      } else {
        let storeRealm = _getStore("1");
        _updateStore(storeRealm, lang, "lang");
      }
      return { ...state, lang };
      break;
    }

    case SET_COUNTRY: {
      let country = String(action.country);
      if (availiableCountries.indexOf(country) === -1) return state;
      return { ...state, country };
      break;
    }

    case SET_CURRENT_LOCATION: {
      let { latitude, longitude } = action.currentLocation;
      if (!(typeof latitude === "number") || !(typeof longitude === "number"))
        return state;
      return {
        ...state,
        searchEngine: {
          ...state.searchEngine,
          userInput: {
            ...state.searchEngine.userInput,
            GEOLOCATE: {
              timeStamp: new Date(),
              currentLocation: {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)
              }
            }
          }
        }
      };
      break;
    }
    case UPDATE_STORE_UI: {
      return {
        ...state,
        lang: action.store
      };
      break;
    }

    default:
      return state;
  }
  return state;
};
