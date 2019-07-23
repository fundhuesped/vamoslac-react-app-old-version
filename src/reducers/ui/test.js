import UIReducer from ".";
import {
  selectLookingFor,
  selectSortEngine,
  selectSearchEngine,
  setResultList,
  setLang,
  setCountry,
  setCurrentLocation
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

describe("UI Reducer", () => {
  describe("Common action cases", () => {
    it("SELECT_LOOKING_FOR action is working as expected", () => {
      expect(UIReducer(initialState, selectLookingFor(CON)).lookingFor).toEqual(
        CON
      );
    });
    it("SELECT_SORT_ENGINE action is working as expected", () => {
      expect(
        UIReducer(initialState, selectSortEngine(DISTANCE)).sortEngine.selected
      ).toEqual(DISTANCE);
    });
    it("SELECT_SEARCH_ENGINE action is working as expected", () => {
      expect(
        UIReducer(initialState, selectSearchEngine(GEOLOCATE)).searchEngine
          .selected
      ).toEqual(GEOLOCATE);
    });
    it("SET_RESULT_LIST action is working as expected", () => {
      expect(
        UIReducer(
          initialState,
          setResultList([
            {
              place: "A beautifull place"
            }
          ])
        ).resultList
      ).toEqual([
        {
          place: "A beautifull place"
        }
      ]);
    });
    it("SET_LANG action is working as expected", () => {
      expect(UIReducer(initialState, setLang(ES)).lang).toEqual(ES);
    });
    it("SET_COUNTRY action is working as expected", () => {
      expect(UIReducer(initialState, setCountry(AR)).country).toEqual(AR);
    });
    it("SET_CURRENT_LOCATION action is working as expected", () => {
      expect(
        UIReducer(initialState, setCurrentLocation(-1.0, 2.5)).userInput
          .GEOLOCATE.currentLocation
      ).toEqual({
        latitude: -1.0,
        longitude: 2.5
      });
    });
  });

  describe("The reducer won't do a shit, because you are using the action as an asshole", () => {
    it("SELECT_LOOKING_FOR action is working as expected", () => {
      expect(() => {
        UIReducer(initialState, selectLookingFor());
      }).toThrow("Review action parameters!");
    });
    it("SELECT_SORT_ENGINE action is working as expected", () => {
      expect(() => {
        UIReducer(initialState, selectSortEngine());
      }).toThrow("Review action parameters!");
    });
    it("SELECT_SEARCH_ENGINE action is working as expected", () => {
      expect(() => {
        UIReducer(initialState, selectSearchEngine());
      }).toThrow("Review action parameters!");
    });
    it("SET_LANG action is working as expected", () => {
      expect(() => {
        UIReducer(initialState, setLang());
      }).toThrow("Review action parameters!");
    });
    it("SET_COUNTRY action is working as expected", () => {
      expect(() => {
        UIReducer(initialState, setCountry());
      }).toThrow("Review action parameters!");
    });
    it("SET_CURRENT_LOCATION action is working as expected", () => {
      expect(() => {
        UIReducer(initialState, setCurrentLocation());
      }).toThrow("Review action parameters!");
    });
  });
});
