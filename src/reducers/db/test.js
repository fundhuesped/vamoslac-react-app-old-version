import DBReducer from ".";
import {
  updatePlaces,
  updateCountries,
  updateProvinces,
  updateCities,
  updateEvaluations
} from "../../constants/actions";

import {
  AR,
  ES,
  DEFAULT,
  CON,
  DISTANCE,
  GEOLOCATE,
  AUTOCOMPLETE
} from "../../constants/action-types";

const initialState = {
  lang: ES,
  country: DEFAULT,
  lookingFor: CON,
  sortEngine: {
    selected: {
      name: DISTANCE,
      engine: undefined
    }
  },
  searchEngine: {
    selected: {
      name: GEOLOCATE,
      engine: undefined
    },
    userInput: {
      GEOLOCATE: {
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

describe("DB Reducer", () => {
  describe("Common cases", () => {
    it("Insert mock fetched places into store.", () => {
      let newState = DBReducer(
        initialState,
        updatePlaces(
          {
            1: [
              {
                placeId: 32,
                ssr: "SI"
              },
              {
                placeId: 33
              }
            ],
            2: [
              {
                placeId: 34
              },
              {
                placeId: 35
              }
            ]
          },
          [1, 2, 3]
        )
      );

      expect(typeof newState).toEqual("object");
      expect(Object.keys(newState.places).length).toEqual(2);
      expect(Object.keys(newState.places.data).length).toEqual(4);
      expect(typeof newState.places.data).toEqual("object");
      expect(Object.keys(newState.places.data["33"]).length).toEqual(73);
      expect(Object.keys(newState.places.meta.failedPages).length).toEqual(3);
      expect(newState.places.meta.updatedAt instanceof Date).toEqual(true);
      expect(Array.isArray(newState.places.meta.failedPages)).toEqual(true);
      expect(typeof newState.places.data["33"].latitude).toEqual("number");
      expect(typeof newState.places.data["33"].longitude).toEqual("number");
      expect(typeof newState.places.data["32"].ssr).toEqual("boolean");
      expect(newState.places.data["32"].ssr).toEqual(true);

      let veryNewState = DBReducer(
        newState,
        updatePlaces(
          {
            1: [
              {
                placeId: 32,
                ssr: false
              },
              {
                placeId: 33
              }
            ],
            2: [
              {
                placeId: 34
              },
              {
                placeId: 35
              },
              {
                placeId: 36
              }
            ]
          },
          [1]
        )
      );

      expect(typeof veryNewState).toEqual("object");
      expect(Object.keys(veryNewState.places).length).toEqual(2);
      expect(Object.keys(veryNewState.places.data).length).toEqual(5);
      expect(typeof veryNewState.places.data).toEqual("object");
      expect(Object.keys(veryNewState.places.data["36"]).length).toEqual(73);
      expect(Object.keys(veryNewState.places.meta.failedPages).length).toEqual(
        1
      );
      expect(veryNewState.places.meta.updatedAt instanceof Date).toEqual(true);
      expect(Array.isArray(veryNewState.places.meta.failedPages)).toEqual(true);
      expect(typeof veryNewState.places.data["33"].latitude).toEqual("number");
      expect(typeof veryNewState.places.data["33"].longitude).toEqual("number");
      expect(typeof newState.places.data["32"].ssr).toEqual("boolean");
      expect(newState.places.data["32"].ssr).toEqual(false);
    });

    it("Insert mock fetched countries into store.", () => {
      let newState = DBReducer(
        initialState,
        updateCountries([
          {
            id: 1,
            nombre_pais: "Argentina",
            zoom: 3
          },
          {
            id: 2,
            nombre_pais: "Brasil",
            zoom: 1
          }
        ])
      );
      expect(newState.countries.length).toEqual(2);
      expect(newState.countries[0].id).toEqual(1);
      expect(newState.countries[0].name).toEqual("Argentina");
      expect(newState.countries[0].zoom).toEqual(3);
      expect(Object.keys(newState.countries[0]).length).toEqual(3);
    });

    it("Insert mock fetched provinces into store.", () => {
      let newState = DBReducer(
        initialState,
        updateProvinces([
          {
            id: 1,
            nombre_provincia: "Entre Ríos"
          },
          {
            id: 2,
            nombre_provincia: "Buenos Aires"
          }
        ])
      );
      expect(newState.provinces.length).toEqual(2);
      expect(newState.provinces[0].id).toEqual(1);
      expect(newState.provinces[0].name).toEqual("Entre Ríos");
    });

    it("Insert mock fetched cities into store.", () => {
      let newState = DBReducer(
        initialState,
        updateCities([
          {
            id: 1,
            nombre_partido: "Paraná"
          },
          {
            id: 2,
            nombre_partido: "Santa Fe"
          }
        ])
      );
      expect(newState.cities.length).toEqual(2);
      expect(newState.cities[0].id).toEqual(1);
      expect(newState.cities[0].name).toEqual("Paraná");
    });
  });
});
