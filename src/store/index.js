import { applyMiddleware, createStore, compose, combineReducers } from "redux";

import { createLogger } from "redux-logger";

const logger = createLogger({});

import { loadState } from "../storage";
import db from "../reducers/db";
import ui from "../reducers/ui";

const middleware = applyMiddleware(logger);

let rootReducer = combineReducers({
  ui,
  db
});

/**********************************************************************************/
/* This enhancer let's Redux Dev Tools (Chrome ext.) to find the app store        */
/**********************************************************************************/
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// let store = (global.__DEV__) ? createStore(rootReducer, composeEnhancers(middleware)) : createStore(rootReducer)
let store = createStore(rootReducer);

export default store;
