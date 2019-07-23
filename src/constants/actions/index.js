import {
  SELECT_LOOKING_FOR,
  SELECT_SORT_ENGINE,
  SELECT_SEARCH_ENGINE,
  SET_RESULT_LIST,
  UPDATE_PLACES,
  UPDATE_COUNTRIES,
  UPDATE_PROVINCES,
  UPDATE_CITIES,
  UPDATE_EVALUATIONS,
  SET_LANG,
  SET_COUNTRY,
  SET_CURRENT_LOCATION,
  FETCHING,
  UPDATE_STORE_DB,
  UPDATE_STORE_UI,
  SET_TERMS_CONDITIONS
} from "../../constants/action-types";

export const updatePlaces = (places, failedPages) => {
  // if (!places || !failedPages) throw Error("Review action parameters updatePlaces!")
  return {
    type: UPDATE_PLACES,
    places,
    failedPages
  };
};
export const updateEvaluations = evaluations => {
  if (!evaluations) throw Error("Review action parameters updateEvaluations!");
  return {
    type: UPDATE_EVALUATIONS,
    evaluations
  };
};
export const updateCountries = countries => {
  if (!countries) throw Error("Review action parameters updateCountries!");
  return {
    type: UPDATE_COUNTRIES,
    countries
  };
};
export const updateProvinces = provinces => {
  if (!provinces) throw Error("Review action parameters updateProvinces!");
  return {
    type: UPDATE_PROVINCES,
    provinces
  };
};
export const updateCities = cities => {
  // if (!cities) throw Error("Review action parameters updateCities!")
  return {
    type: UPDATE_CITIES,
    cities
  };
};
export const selectLookingFor = lookingFor => {
  if (!lookingFor) throw Error("Review action parameters selectLookingFor!");
  return {
    type: SELECT_LOOKING_FOR,
    lookingFor
  };
};
export const selectSortEngine = sortEngine => {
  if (!sortEngine) throw Error("Review action parameters selectSortEngine!");
  return {
    type: SELECT_SORT_ENGINE,
    sortEngine
  };
};
export const selectSearchEngine = searchEngine => {
  if (!searchEngine)
    throw Error("Review action parameters selectSearchEngine!");
  return {
    type: SELECT_SEARCH_ENGINE,
    searchEngine
  };
};
export const setResultList = resultList => {
  if (!resultList) throw Error("Review action parameters setResultList!");
  return {
    type: SET_RESULT_LIST,
    resultList
  };
};
export const setLang = lang => {
  if (!lang) throw Error("Review action parameters setLang!");
  return {
    type: SET_LANG,
    lang
  };
};
export const setCountry = country => {
  if (!country) throw Error("Review action parameters setCountry!");
  return {
    type: SET_COUNTRY,
    country
  };
};
export const setCurrentLocation = (latitude, longitude) => {
  if (!latitude || !longitude)
    throw Error("Review action parameters setCurrentLocation!");
  return {
    type: SET_CURRENT_LOCATION,
    currentLocation: {
      latitude,
      longitude
    }
  };
};
export const startFetching = () => {
  return {
    type: FETCHING
  };
};

export const setTermsConditions = () => {
  return {
    type: SET_TERMS_CONDITIONS
  };
};

export const updateStoreDB = store => {
  if (!store) throw Error("Review action parameters updateStoreDB!");
  return {
    type: UPDATE_STORE_DB,
    store
  };
};
export const updateStoreUI = store => {
  if (!store) throw Error("Review action parameters updateStoreUI!");
  return {
    type: UPDATE_STORE_UI,
    store
  };
};
